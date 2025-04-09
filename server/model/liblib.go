package model

const (
	TemplateUuid        = "5d7e67009b344550bc1aa6ccbfa1d7f4"
	LibGenerateSuccess  = 5
	LibGenerateFail     = 6
	LibGenerateOverTime = 7
)

type (
	SSPResultCommon struct {
		Code    int    `json:"code"`
		Message string `json:"msg"`
	}

	// 图片尺寸配置
	ImageSize struct {
		Width  int `json:"width"`  // 图片宽度
		Height int `json:"height"` // 图片高度
	}

	// ControlNet配置
	ControlNetConfig struct {
		ControlType  string `json:"controlType"`  // 控制类型，如："depth"
		ControlImage string `json:"controlImage"` // 控制图URL
	}
	GenerateParams struct {
		// 必填参数
		Prompt      string `json:"prompt"`      // 提示词，如："1 girl,lotus leaf..."
		AspectRatio string `json:"aspectRatio"` // 比例类型："portrait"(竖版)/"landscape"(横版)/"square"(方形)
		ImgCount    int    `json:"imgCount"`    // 生成图片数量

		// 图片尺寸二选一
		ImageSize *ImageSize `json:"imageSize,omitempty"` // 具体宽高（与AspectRatio二选一）

		// 生成参数
		Steps int `json:"steps"` // 采样步数，建议30

		// 高级参数（可选）
		ControlNet *ControlNetConfig `json:"controlnet,omitempty"` // ControlNet配置
	}
	TextToGraphRequest struct {
		TemplateUuid   string          `json:"templateUuid"`
		GenerateParams *GenerateParams `json:"generateParams"`
	}
	TextToGraphData struct {
		GenerateUuid string `json:"generateUuid"` // 生成UUID
	}
	TextToGraphResponse struct {
		SSPResultCommon
		Data TextToGraphData `json:"data"`
	}

	GetGraphResultRequest struct {
		GenerateUuid string `json:"generateUuid"` // 生成UUID
	}

	Image struct {
		ImageUrl    string `json:"imageUrl"`    // 图片URL
		Seed        int64  `json:"seed"`        // 种子值
		AuditStatus int    `json:"auditStatus"` // 审核状态
	}

	GetGraphResultData struct {
		GenerateUuid     string  `json:"generateUuid"`     // 生成任务的UUID
		GenerateStatus   int     `json:"generateStatus"`   // 生成状态
		PercentCompleted float64 `json:"percentCompleted"` // 完成百分比
		GenerateMsg      string  `json:"generateMsg"`      // 生成消息
		PointsCost       int     `json:"pointsCost"`       // 本次任务消耗积分数
		AccountBalance   int     `json:"accountBalance"`   // 账户剩余积分数
		Images           []Image `json:"images"`           // 生成的图片列表
	}

	GetGraphResultResponse struct {
		SSPResultCommon
		Data GetGraphResultData `json:"data"`
	}
)
