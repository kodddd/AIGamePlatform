// request.go
// 精简版 HTTP 请求模块（无日志/监控依赖）
package agent

import (
	"bytes"
	"context"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"
)

var (
	// 全局HTTP客户端配置（可根据需要调整）
	transport = &http.Transport{
		Proxy: http.ProxyFromEnvironment,
		DialContext: (&net.Dialer{
			Timeout:   30 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
		MaxIdleConns:          100,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   10 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
	}

	HttpClient = http.Client{
		Timeout:   time.Minute*5,
		Transport: transport,
	}

	UploadClient = http.Client{
		Timeout:   time.Hour * 5,
		Transport: transport,
	}
)

const (
	CONTENT_TYPE_JSON        = "application/json"
	CONTENT_TYPE_FORM_DATA   = "multipart/form-data"
	CONTENT_TYPE_URL_ENCODED = "application/x-www-form-urlencoded"
)

var privatePattern = regexp.MustCompile("(client_secret|code)=[^&]+")

// 核心请求结构体
type Request struct {
	ctx             context.Context
	method          string
	url             string
	headers         http.Header
	queryParam      url.Values
	data            interface{}
	formDataBuffer  *bytes.Buffer
	contentType     string
	responseHandler func(*http.Response, interface{}) error // 简化ResponseHandler
	signer          func(*http.Request) error
}

// 构造函数
func NewRequest(ctx context.Context, method string) *Request {
	return &Request{
		ctx:        ctx,
		method:     method,
		headers:    make(http.Header),
		queryParam: make(url.Values),
	}
}

// 快捷方法
func Get(ctx context.Context) *Request    { return NewRequest(ctx, "GET") }
func Post(ctx context.Context) *Request   { return NewRequest(ctx, "POST") }
func Put(ctx context.Context) *Request    { return NewRequest(ctx, "PUT") }
func Delete(ctx context.Context) *Request { return NewRequest(ctx, "DELETE") }

// 链式调用方法
func (r *Request) Url(url string) *Request               { r.url = url; return r }
func (r *Request) Header(key, value string) *Request     { r.headers.Set(key, value); return r }
func (r *Request) QueryParam(key, value string) *Request { r.queryParam.Add(key, value); return r }
func (r *Request) Token(token string) *Request           { return r.Header("Authorization", token) }

// 设置请求体
func (r *Request) Json(data interface{}) *Request {
	r.contentType = CONTENT_TYPE_JSON
	r.Header("Content-Type", CONTENT_TYPE_JSON)
	r.data = data
	return r
}

func (r *Request) FormData(buf *bytes.Buffer, writer *multipart.Writer) *Request {
	r.contentType = CONTENT_TYPE_FORM_DATA
	r.Header("Content-Type", writer.FormDataContentType())
	r.formDataBuffer = buf
	return r
}

func (r *Request) UrlEncoded(data url.Values) *Request {
	r.contentType = CONTENT_TYPE_URL_ENCODED
	r.Header("Content-Type", CONTENT_TYPE_URL_ENCODED)
	r.data = data
	return r
}

// 执行请求
func (r *Request) Do(result interface{}) (*http.Response, error) {
	// 构建URL
	urlStr := r.url
	if query := r.queryParam.Encode(); query != "" {
		if strings.Contains(urlStr, "?") {
			urlStr += "&" + query
		} else {
			urlStr += "?" + query
		}
	}

	// 构建请求体
	var body io.Reader
	switch r.contentType {
	case CONTENT_TYPE_JSON:
		buf, err := json.Marshal(r.data)
		if err != nil {
			return nil, fmt.Errorf("json marshal error: %w", err)
		}
		body = bytes.NewBuffer(buf)

	case CONTENT_TYPE_FORM_DATA:
		if r.formDataBuffer != nil {
			body = bytes.NewReader(r.formDataBuffer.Bytes())
		}

	case CONTENT_TYPE_URL_ENCODED:
		if params, ok := r.data.(url.Values); ok {
			body = bytes.NewBufferString(params.Encode())
		}
	}

	// 创建请求
	req, err := http.NewRequest(r.method, urlStr, body)
	if err != nil {
		return nil, fmt.Errorf("create request error: %w", err)
	}
	req.Header = r.headers

	// 签名处理（如有）
	if r.signer != nil {
		if err := r.signer(req); err != nil {
			return nil, fmt.Errorf("sign request error: %w", err)
		}
	}

	// 执行请求
	client := HttpClient // 默认客户端
	resp, err := client.Do(req)
	if err != nil {
		return resp, fmt.Errorf("do request error: %w", err)
	}
	defer resp.Body.Close()

	// 处理响应
	if r.responseHandler != nil {
		return resp, r.responseHandler(resp, result)
	}
	return resp, defaultResponseHandler(resp, result)
}

// End 执行请求并处理响应（兼容旧版调用方式）
func (r *Request) End(result interface{}) (*http.Response, error) {
	// 构建请求
	resp, err := r.Do(result)
	if err != nil {
		return resp, err
	}

	// 兼容旧版行为：自动丢弃响应体
	if result == nil {
		defer resp.Body.Close()
		_, _ = io.Copy(io.Discard, resp.Body)
	}

	return resp, nil
}

// 默认响应处理器
func defaultResponseHandler(resp *http.Response, result interface{}) error {
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("bad status: %d", resp.StatusCode)
	}

	if result == nil {
		return nil
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("read body error: %w", err)
	}

	if len(body) == 0 {
		return nil
	}

	if err := json.Unmarshal(body, result); err != nil {
		return fmt.Errorf("json unmarshal error: %w", err)
	}

	return nil
}

// 辅助函数
func hash(text string) string {
	h := sha1.New()
	io.WriteString(h, text)
	return fmt.Sprintf("%x", h.Sum(nil))
}

func maskURL(rawURL string) string {
	return privatePattern.ReplaceAllString(rawURL, "$1=********")
}

func (r *Request) GetUrl() string {
	return r.url
}
