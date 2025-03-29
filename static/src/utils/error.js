/**
 * API错误处理工具
 * @param {Error} error - Axios错误对象
 * @returns {Error} 处理后的错误对象
 */
export const handleApiError = (error) => {
  // 网络错误
  if (error.message === "Network Error") {
    return new Error("网络连接失败，请检查网络设置");
  }

  // 请求超时
  if (error.code === "ECONNABORTED") {
    return new Error("请求超时，请稍后重试");
  }

  // 服务器响应错误
  if (error.response) {
    const { status, data } = error.response;
    const defaultMessage = `请求失败 (${status})`;

    switch (status) {
      case 400:
        return new Error(data.message || "请求参数错误");
      case 401:
        return new Error(data.message || "请先登录");
      case 403:
        return new Error(data.message || "没有操作权限");
      case 404:
        return new Error(data.message || "资源不存在");
      case 422:
        // 表单验证错误
        if (data.errors) {
          const messages = Object.values(data.errors).flat();
          return new Error(messages.join(", ") || "表单验证失败");
        }
        return new Error(data.message || "验证失败");
      case 500:
        return new Error(data.message || "服务器内部错误");
      default:
        return new Error(data.message || defaultMessage);
    }
  }

  // 其他未知错误
  return new Error(error.message || "未知错误，请稍后重试");
};

/**
 * 错误消息显示Hook
 * @returns {{
 *   showError: function,
 *   ErrorDisplay: React.Component
 * }}
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const showError = (error) => {
    const normalizedError =
      error instanceof Error ? error : new Error(String(error));
    setError(normalizedError);
  };

  const clearError = () => setError(null);

  const ErrorDisplay = () =>
    error && (
      <div className="error-message">
        {error.message}
        <button onClick={clearError}>×</button>
      </div>
    );

  return { showError, ErrorDisplay, error, clearError };
};

/**
 * 错误边界组件
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 可以在这里记录错误到日志服务
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>出错了</h2>
          <p>{this.state.error.message}</p>
          <button onClick={this.handleRetry}>重试</button>
        </div>
      );
    }

    return this.props.children;
  }
}
