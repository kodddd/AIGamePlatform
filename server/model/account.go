package model

type (
	Account struct {
		UserName string `json:"userName" bson:"userName"`
		Email    string `json:"email" bson:"email"`
		Password string `json:"-" bson:"password"`
	}

	GetMeResult struct{
		Code    int      `json:"code"`
		Message string   `json:"message"`
		User    *Account `json:"user,omitempty"`
	}

	GetMeResponse struct{
		UserName string `json:"userName"`
		Email    string `json:"email"`
	}

	LoginRequest struct {
		UserName string `json:"userName" bson:"userName"`
		Email    string `json:"email" bson:"email"`
		Password string `json:"password" bson:"password"`
	}

	LoginResult struct {
		Code    int      `json:"code"`
		Message string   `json:"message"`
		User    *Account `json:"user,omitempty"`
		Token   string   `json:"token,omitempty"`
	}

	LoginResponse struct {
		Token    string `json:"token"`
		UserName string `json:"userName"`
		Email    string `json:"email"`
	}

	RegisterRequest struct {
		UserName string `json:"userName" bson:"userName"`
		Email    string `json:"email" bson:"email"`
		Password string `json:"password" bson:"password"`
	}

	RegisterResult struct {
		Code    int      `json:"code"`
		Message string   `json:"message"`
		User    *Account `json:"user,omitempty"`
		Token   string   `json:"token,omitempty"`
	}

	RegisterResponse struct {
		Token    string `json:"token"`
		UserName string `json:"userName"`
		Email    string `json:"email"`
	}

	UpdateProfileRequest struct {
		UserName string `json:"userName"`
		Email string `json:"email"`
	}

	UpdateProfileResult struct{
		Code int `json:"code"`
		Message string `json:"message"`
		User *Account `json:"user"`
	}
	UpdateProfileResponse struct{
		UserName string `json:"userName"`
		Email string `json:"email"`
	}
	UpdatePasswordRequest struct{
		CurrentPassword string `json:"currentPassword"`
		NewPassword string `json:"newPassword"`
	}
	UpdatePasswordResult struct{
		Code int `json:"code"`
		Message string `json:"message"`
	}
)
