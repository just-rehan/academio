"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Checkbox } from "./checkbox";
import { 
  Eye, 
  EyeOff, 
  Sparkles, 
  GraduationCap, 
  Shield, 
  UserCheck, 
  BookOpen, 
  ArrowLeft,
  CheckCircle2,
  LogIn,
  UserPlus
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types/academic";

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({ 
  size = 12, 
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };

    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;

    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({ 
  size = 48, 
  pupilSize = 16, 
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

export function AnimatedLoginPage({ 
  onLoginSuccess,
  onBack
}: { 
  onLoginSuccess: () => void;
  onBack?: () => void;
}) {
  const { setCurrentRole } = useApp();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In state
  const [email, setEmail] = useState("ananya.sharma@rvce.edu.in");
  const [password, setPassword] = useState("••••••••");

  // Register state
  const [regFullName, setRegFullName] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("student");
  const [regId, setRegId] = useState("");
  const [regDept, setRegDept] = useState("Computer Science & Engineering");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Character animation states
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking effect for purple character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => {
          setIsPurpleBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Blinking effect for black character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => {
          setIsBlackBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Looking at each other animation when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => {
        setIsLookingAtEachOther(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Purple sneaky peeking animation when typing password and it's visible
  const activePasswordLength = tab === 'signin' ? password.length : regPassword.length;
  useEffect(() => {
    if (activePasswordLength > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => {
            setIsPurplePeeking(false);
          }, 800);
        }, Math.random() * 3000 + 2000);
        return peekInterval;
      };

      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [activePasswordLength, showPassword]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));

    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Route according to email/usn hints or default to teacher
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes("admin")) {
      setCurrentRole("admin");
    } else if (lowerEmail.includes("class")) {
      setCurrentRole("class_teacher");
    } else if (lowerEmail.includes("student") || lowerEmail.includes("1rv")) {
      setCurrentRole("student");
    } else {
      setCurrentRole("teacher");
    }

    onLoginSuccess();
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!regFullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!regEmail.trim()) {
      setError("Please enter your academic email address.");
      return;
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("Please accept the Academio Academic Code of Conduct.");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    setCurrentRole(regRole);
    setSuccessMsg(`Welcome to Academio, ${regFullName}! Account successfully created.`);
    setTimeout(() => {
      onLoginSuccess();
    }, 400);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FDFDFD]">
      {/* Left Animated Characters Stage */}
      <div className="relative hidden lg:flex flex-col justify-between bg-black p-12 text-white overflow-hidden select-none">
        <div className="relative z-20">
          <div className="flex items-center gap-2.5 text-lg font-black tracking-tight">
            <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Academio</span>
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40 ml-1">
              Your Academic Hub
            </span>
          </div>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[520px]">
          {/* Cartoon Characters */}
          <div className="relative" style={{ width: '550px', height: '420px' }}>
            {/* Purple tall rectangle character */}
            <div 
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '70px',
                width: '180px',
                height: (isTyping || (activePasswordLength > 0 && !showPassword)) ? '440px' : '400px',
                backgroundColor: '#6C3FF5',
                borderRadius: '40px 40px 0 0',
                zIndex: 1,
                transform: (activePasswordLength > 0 && showPassword)
                  ? `skewX(0deg)`
                  : (isTyping || (activePasswordLength > 0 && !showPassword))
                    ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                    : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left: (activePasswordLength > 0 && showPassword) ? `20px` : isLookingAtEachOther ? `55px` : `${45 + purplePos.faceX}px`,
                  top: (activePasswordLength > 0 && showPassword) ? `35px` : isLookingAtEachOther ? `65px` : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall 
                  size={18} 
                  pupilSize={7} 
                  maxDistance={5} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isPurpleBlinking}
                  forceLookX={(activePasswordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={(activePasswordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                />
                <EyeBall 
                  size={18} 
                  pupilSize={7} 
                  maxDistance={5} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isPurpleBlinking}
                  forceLookX={(activePasswordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={(activePasswordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                />
              </div>
            </div>

            {/* Black tall rectangle character */}
            <div 
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '240px',
                width: '120px',
                height: '310px',
                backgroundColor: '#2D2D2D',
                borderRadius: '30px 30px 0 0',
                zIndex: 2,
                transform: (activePasswordLength > 0 && showPassword)
                  ? `skewX(0deg)`
                  : isLookingAtEachOther
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                    : (isTyping || (activePasswordLength > 0 && !showPassword))
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                      : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left: (activePasswordLength > 0 && showPassword) ? `10px` : isLookingAtEachOther ? `32px` : `${26 + blackPos.faceX}px`,
                  top: (activePasswordLength > 0 && showPassword) ? `28px` : isLookingAtEachOther ? `12px` : `${32 + blackPos.faceY}px`,
                }}
              >
                <EyeBall 
                  size={16} 
                  pupilSize={6} 
                  maxDistance={4} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isBlackBlinking}
                  forceLookX={(activePasswordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={(activePasswordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                />
                <EyeBall 
                  size={16} 
                  pupilSize={6} 
                  maxDistance={4} 
                  eyeColor="white" 
                  pupilColor="#2D2D2D" 
                  isBlinking={isBlackBlinking}
                  forceLookX={(activePasswordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={(activePasswordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined}
                />
              </div>
            </div>

            {/* Orange semi-circle character */}
            <div 
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '0px',
                width: '240px',
                height: '200px',
                zIndex: 3,
                backgroundColor: '#FF9B6B',
                borderRadius: '120px 120px 0 0',
                transform: (activePasswordLength > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left: (activePasswordLength > 0 && showPassword) ? `50px` : `${82 + (orangePos.faceX || 0)}px`,
                  top: (activePasswordLength > 0 && showPassword) ? `85px` : `${90 + (orangePos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(activePasswordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(activePasswordLength > 0 && showPassword) ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(activePasswordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(activePasswordLength > 0 && showPassword) ? -4 : undefined} />
              </div>
            </div>

            {/* Yellow tall rectangle character */}
            <div 
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '310px',
                width: '140px',
                height: '230px',
                backgroundColor: '#E8D754',
                borderRadius: '70px 70px 0 0',
                zIndex: 4,
                transform: (activePasswordLength > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <div 
                className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left: (activePasswordLength > 0 && showPassword) ? `20px` : `${52 + (yellowPos.faceX || 0)}px`,
                  top: (activePasswordLength > 0 && showPassword) ? `35px` : `${40 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(activePasswordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(activePasswordLength > 0 && showPassword) ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D" forceLookX={(activePasswordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(activePasswordLength > 0 && showPassword) ? -4 : undefined} />
              </div>
              <div 
                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left: (activePasswordLength > 0 && showPassword) ? `10px` : `${40 + (yellowPos.faceX || 0)}px`,
                  top: (activePasswordLength > 0 && showPassword) ? `88px` : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span>VTU Academic System</span>
            <span>Integrated Portal</span>
          </div>
          <span>Academio v2.4</span>
        </div>
      </div>

      {/* Right Login / Register Section */}
      <div className="flex items-center justify-center px-4 py-8 sm:p-10 w-full min-w-0 overflow-y-auto max-h-screen">
        <div className="w-full max-w-[440px] my-auto">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft size={14} /> Back to Overview
            </button>
          )}

          {/* Mobile Brand Banner */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-4">
            <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
              <Sparkles className="size-4" />
            </div>
            <span className="font-black text-2xl tracking-tight text-black">Academio</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
              {tab === 'signin' ? 'Welcome back!' : 'Create your account'}
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mt-1">
              Academio • Your Academic Hub
            </p>
          </div>

          {/* Animated Tab Switcher */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center mb-6">
            <button
              type="button"
              onClick={() => { setTab('signin'); setError(''); }}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5",
                tab === 'signin' 
                  ? "bg-white text-black shadow-xs" 
                  : "text-gray-500 hover:text-black"
              )}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); }}
              className={cn(
                "flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5",
                tab === 'register' 
                  ? "bg-white text-black shadow-xs" 
                  : "text-gray-500 hover:text-black"
              )}
            >
              <UserPlus size={14} />
              <span>Register</span>
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  College Email / USN
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="student@college.edu or 1RV22CS084"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  required
                  className="h-11 bg-gray-50 border-gray-200 rounded-xl px-3.5 font-medium text-sm focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showPassword ? "Hide" : "Peek"}</span>
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    required
                    className="h-11 bg-gray-50 border-gray-200 rounded-xl px-3.5 pr-11 font-medium text-sm focus:ring-black focus:border-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="rounded-md border-gray-300" defaultChecked />
                  <Label htmlFor="remember" className="text-xs font-medium text-gray-600 cursor-pointer">
                    Stay signed in
                  </Label>
                </div>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Use the 1-Click Demo role buttons below or your default credentials."); }} className="text-xs font-semibold text-blue-600 hover:underline">
                  Forgot Key?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-gray-800 text-white shadow-md transition-all active:scale-[0.99] mt-2" 
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In to Portal"}
              </Button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Select Role
                </Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { role: 'student', label: 'Student', icon: GraduationCap },
                    { role: 'teacher', label: 'Subject Faculty', icon: BookOpen },
                    { role: 'class_teacher', label: 'Class Teacher', icon: UserCheck },
                    { role: 'admin', label: 'Admin', icon: Shield },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = regRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setRegRole(item.role as UserRole)}
                        className={cn(
                          "py-2 px-2.5 rounded-lg border text-left text-xs font-semibold flex items-center gap-1.5 transition-all",
                          isSelected 
                            ? "border-black bg-black text-white shadow-xs" 
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                        )}
                      >
                        <Icon size={14} className={isSelected ? "text-white" : "text-gray-500"} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="regFullName" className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Full Name
                </Label>
                <Input
                  id="regFullName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  required
                  className="h-10 bg-gray-50 border-gray-200 rounded-xl px-3 font-medium text-xs focus:ring-black focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="regId" className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                    {regRole === 'student' ? 'USN' : 'Faculty / Staff ID'}
                  </Label>
                  <Input
                    id="regId"
                    type="text"
                    placeholder={regRole === 'student' ? '1RV22CS084' : 'FAC-CSE-042'}
                    value={regId}
                    onChange={(e) => setRegId(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    className="h-10 bg-gray-50 border-gray-200 rounded-xl px-3 font-medium text-xs focus:ring-black focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="regDept" className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Department
                  </Label>
                  <Input
                    id="regDept"
                    type="text"
                    placeholder="CSE / ISE / ECE"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    className="h-10 bg-gray-50 border-gray-200 rounded-xl px-3 font-medium text-xs focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="regEmail" className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  College Email Address
                </Label>
                <Input
                  id="regEmail"
                  type="email"
                  placeholder="name@college.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  required
                  className="h-10 bg-gray-50 border-gray-200 rounded-xl px-3 font-medium text-xs focus:ring-black focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="regPassword" className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="regPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      required
                      className="h-10 bg-gray-50 border-gray-200 rounded-xl px-3 pr-8 font-medium text-xs focus:ring-black focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="regConfirmPassword" className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="regConfirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      required
                      className="h-10 bg-gray-50 border-gray-200 rounded-xl px-3 pr-8 font-medium text-xs focus:ring-black focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox 
                  id="agreeTerms" 
                  checked={agreeTerms} 
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  className="rounded-md border-gray-300"
                />
                <Label htmlFor="agreeTerms" className="text-xs text-gray-600 cursor-pointer">
                  I agree to the <span className="font-semibold text-black">Academio Honor Code</span> & Policies
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-black hover:bg-gray-800 text-white shadow-md transition-all active:scale-[0.99] mt-2" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Academio Account"}
              </Button>
            </form>
          )}

          {/* Quick 1-Click Role Preview */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                1-Click Demo Role Preview
              </span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('admin');
                  onLoginSuccess();
                }}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <Shield size={14} className="text-purple-600" />
                  <span>Admin</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">Platform Owner (Me)</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentRole('class_teacher');
                  onLoginSuccess();
                }}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <UserCheck size={14} className="text-blue-600" />
                  <span>Class Teacher</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">Dr. K. Srinivas (5th A)</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentRole('teacher');
                  onLoginSuccess();
                }}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <BookOpen size={14} className="text-emerald-600" />
                  <span>Subject Teacher</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">Prof. Ananya (Networks)</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentRole('student');
                  onLoginSuccess();
                }}
                className="p-2.5 rounded-xl border border-gray-200 hover:border-black hover:bg-gray-50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <GraduationCap size={14} className="text-amber-600" />
                  <span>Student</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">Rahul (1RV22CS084)</p>
              </button>
            </div>
          </div>

          <div className="text-center text-[10px] font-bold text-gray-400 mt-5 uppercase tracking-wide">
            VTU BE CSE 5th Semester • Academio — Your Academic Hub
          </div>
        </div>
      </div>
    </div>
  );
}

// Alias export for compatibility
export { AnimatedLoginPage as LoginSignupPage };
