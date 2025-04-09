package model

type (
	GeneratePictureRequest struct {
		Text        string `json:"text"`
		Style       string `json:"style"`
		AspectRatio string `json:"aspectRatio"`
	}
	GeneratePictureResponse struct {
		Url string `json:"url"`
	}
	GeneratePictureResult struct {
		Code     int                      `json:"code"`
		Message  string                   `json:"message"`
		Response *GeneratePictureResponse `json:"response"`
	}
)
