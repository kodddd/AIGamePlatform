package model

type (
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

	RegisterErrorResponse struct {
		BasicErrorData
	}

	Account struct {
		UserName string `json:"userName" bson:"userName"`
		Email    string `json:"email" bson:"email"`
		Password string `json:"-" bson:"password"`
	}
)
