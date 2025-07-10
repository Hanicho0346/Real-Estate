import React, { useState } from "react";
import { Chrome, Apple, Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") calculatePasswordStrength(value);
  };

  const calculatePasswordStrength = (password: string) => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    setPasswordStrength(checks.filter(Boolean).length);
  };

  const passwordStrengthData = [
    { threshold: 2, color: "bg-red-500", text: "Weak" },
    { threshold: 3, color: "bg-yellow-500", text: "Medium" },
    { threshold: 5, color: "bg-green-500", text: "Strong" },
  ];

  const getPasswordStrength = () => {
    return passwordStrengthData.find(
      item => passwordStrength <= item.threshold
    ) || passwordStrengthData[2];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { name, username, email, password } = formData;
      const res = await apiRequest.post("/auth/register", {
        username,
        name,
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = 
    formData.password === formData.confirmPassword && 
    formData.confirmPassword !== "";

  const InputField = ({ 
    icon: Icon, 
    type, 
    name, 
    placeholder, 
    showToggle, 
    toggleKey 
  }: {
    icon: React.ComponentType<{ size: number }>;
    type: string;
    name: string;
    placeholder: string;
    showToggle?: boolean;
    toggleKey?: keyof typeof showPassword;
  }) => (
    <div className="group">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200"
          size={18}
        />
        <input
          id={name}
          name={name}
          type={type}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleInputChange}
          required
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white"
        />
        {showToggle && toggleKey && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => ({
              ...prev,
              [toggleKey]: !prev[toggleKey]
            }))}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword[toggleKey] ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {name === "confirmPassword" && formData.confirmPassword && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            {passwordsMatch ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs">✕</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-[750px] flex">
    
      <div className="hidden lg:block w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="h-full flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to Our Platform</h1>
            <p className="text-xl mb-8">Join thousands of happy users who found their perfect match</p>
            <div className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl border border-white/30">
              <p className="text-lg italic">"This platform changed my life! Easy to use and so effective."</p>
              <p className="mt-4 font-medium">- Sarah Johnson</p>
            </div>
          </div>
        </div>
      </div>

 
      <div className="w-full lg:w-1/2 flex items-center max-h-[730px] justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Join Us Today
            </h1>
            <p className="text-gray-600">Create your account and start your journey</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all">
              <Chrome className="text-red-500" size={18} />
              <span className="font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all">
              <Apple size={18} />
              <span className="font-medium">Apple</span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="space-y-4">
              <InputField icon={User} type="text" name="name" placeholder="John Doe" />
              <InputField icon={User} type="text" name="username" placeholder="Johni" />
              <InputField icon={Mail} type="email" name="email" placeholder="your@email.com" />
              
              <div>
                <InputField 
                  icon={Lock} 
                  type={showPassword.password ? "text" : "password"} 
                  name="password" 
                  placeholder="••••••••" 
                  showToggle 
                  toggleKey="password"
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Password strength</span>
                      <span className={`font-medium ${getPasswordStrength().color.replace('bg', 'text')}`}>
                        {getPasswordStrength().text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getPasswordStrength().color}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <InputField
                icon={Lock}
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                showToggle
                toggleKey="confirmPassword"
              />
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                I agree to the{" "}
                <Link to="/terms" className="text-emerald-600 hover:text-emerald-500 font-medium">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-emerald-600 hover:text-emerald-500 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading || !passwordsMatch || !formData.agreeToTerms}
              className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;