import { useState } from "react";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const url = isRegister
        ? "http://localhost:5000/api/users/register"
        : "http://localhost:5000/api/users/login";

      const body = isRegister
        ? {
            name,
            email,
            password,
          }
        : {
            email,
            password,
          };

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            (isRegister
              ? "Registration failed"
              : "Login failed")
        );

        setLoading(false);
        return;
      }

      /* REGISTER */

      if (isRegister) {
        setMessage(
          "Account created successfully! You can now login."
        );

        setIsRegister(false);

        setName("");
        setPassword("");

        setLoading(false);
        return;
      }

      /* LOGIN */

      localStorage.setItem("token", data.token);

      setMessage("Login successful!");

      onLogin();

    } catch (error) {
      console.error("Authentication error:", error);

      setMessage(
        "Unable to connect to backend"
      );
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          A
        </div>

        <h1>
          AI Emergency Corridor
        </h1>

        <p className="auth-subtitle">
          Emergency Response System
        </p>


        <div className="auth-title">

          <h2>
            {isRegister
              ? "Create Account"
              : "Welcome Back"}
          </h2>

          <p>
            {isRegister
              ? "Create your account to access the system."
              : "Sign in to manage emergency corridors."}
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          {/* NAME ONLY FOR REGISTER */}

          {isRegister && (
            <div className="auth-input">

              <label>
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>
          )}


          {/* EMAIL */}

          <div className="auth-input">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="auth-input">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >

            {loading
              ? isRegister
                ? "Creating Account..."
                : "Logging in..."
              : isRegister
              ? "Create Account"
              : "Login"}

          </button>

        </form>


        {message && (
          <div className="auth-message">
            {message}
          </div>
        )}


        <div className="auth-switch">

          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);

              setMessage("");

              setName("");
              setEmail("");
              setPassword("");
            }}
          >
            {isRegister
              ? "Login"
              : "Create Account"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;