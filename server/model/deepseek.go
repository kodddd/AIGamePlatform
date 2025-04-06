package model

type (
	CommunicateRequest struct {
		Model    string        `json:"model"`    // 模型名称，如 "deepseek-chat"
		Messages []ChatMessage `json:"messages"` // 消息列表
		Stream   bool          `json:"stream"`   // 是否流式输出
	}
	ChatMessage struct {
		Role    string `json:"role"`    // 角色，如 "system"、"user"、"assistant"
		Content string `json:"content"` // 消息内容
	}
	CommunicateResponse struct {
		ID      string       `json:"id"`      // 请求ID
		Object  string       `json:"object"`  // 对象类型，如 "chat.completion"
		Created int64        `json:"created"` // 创建时间（Unix时间戳）
		Model   string       `json:"model"`   // 使用的模型
		Choices []ChatChoice `json:"choices"` // 返回的选择
		Usage   TokenUsage   `json:"usage"`   // Token 使用情况
	}

	ChatChoice struct {
		Index        int         `json:"index"`         // 选项索引
		Message      ChatMessage `json:"message"`       // 返回的消息
		FinishReason string      `json:"finish_reason"` // 结束原因，如 "stop"
	}

	TokenUsage struct {
		PromptTokens     int `json:"prompt_tokens"`     // 输入的 token 数量
		CompletionTokens int `json:"completion_tokens"` // 输出的 token 数量
		TotalTokens      int `json:"total_tokens"`      // 总 token 数量
	}
)
