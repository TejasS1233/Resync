import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit3,
  Camera,
  LogOut,
  Zap,
  Award,
  TrendingUp,
  Shield,
  Settings,
  Bell,
  Moon,
  Smartphone,
  CheckCircle2,
  Target,
  Clock,
} from "lucide-react";

const ProfilePage = () => {
  const { user, isGuest, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    longestStreak: 0,
    totalCompletions: 0,
    completionRate: 0,
    totalGoals: 0,
    activeGoals: 0,
  });
  const [badges, setBadges] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    joinDate: "",
    location: "",
    level: 1,
    xp: 0,
    nextLevelXp: 1000,
    avatarUrl: null,
  });

  useEffect(() => {
    loadProfileData();
    loadStats();
    loadBadges();
  }, [user, isGuest]);

  const loadProfileData = () => {
    if (isGuest) {
      // Load from localStorage for guest users
      const guestProfile = JSON.parse(localStorage.getItem("guestProfile") || "{}");
      setProfileData({
        name: guestProfile.name || "Guest User",
        email: guestProfile.email || "guest@resync.app",
        joinDate:
          guestProfile.joinDate ||
          new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        location: guestProfile.location || "Not specified",
        level: guestProfile.level || 1,
        xp: guestProfile.xp || 0,
        nextLevelXp: guestProfile.nextLevelXp || 1000,
        avatarUrl: guestProfile.avatarUrl || null,
      });
    } else if (user) {
      // Load from authenticated user data
      setProfileData({
        name: user.name || "User",
        email: user.email || "",
        joinDate: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "Unknown",
        location: user.location || "Not specified",
        level: user.level || 1,
        xp: user.xp || 0,
        nextLevelXp: user.nextLevelXp || 1000,
        avatarUrl: user.avatarUrl || null,
      });
    }
  };

  const loadStats = () => {
    if (isGuest) {
      // Calculate stats from localStorage
      const guestGoals = JSON.parse(localStorage.getItem("guestGoals") || "[]");
      const guestNotes = JSON.parse(localStorage.getItem("guestNotes") || "[]");

      // Calculate completion rate
      const completedGoals = guestGoals.filter((g) => g.completed).length;
      const totalGoals = guestGoals.length;
      const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

      // Calculate streak (based on notes frequency) - using local timezone
      let currentStreak = 0;
      let longestStreak = 0;

      // Normalize dates to local timezone (YYYY-MM-DD format)
      const normalizeToLocalDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      };

      // Get unique dates in sorted order
      const uniqueDates = [...new Set(guestNotes.map((note) => normalizeToLocalDate(note.date)))]
        .sort()
        .reverse();

      if (uniqueDates.length > 0) {
        currentStreak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const date1 = new Date(uniqueDates[i] + "T00:00:00");
          const date2 = new Date(uniqueDates[i + 1] + "T00:00:00");
          const diffDays = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            currentStreak++;
          } else {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
          }
        }
        longestStreak = Math.max(longestStreak, currentStreak);
      }

      setStats({
        longestStreak,
        totalCompletions: completedGoals,
        completionRate,
        totalGoals,
        activeGoals: guestGoals.filter((g) => !g.completed).length,
      });
    } else if (user) {
      // For authenticated users, we would fetch from backend
      // For now, using placeholder until backend provides stats
      setStats({
        longestStreak: user.longestStreak || 0,
        totalCompletions: user.totalCompletions || 0,
        completionRate: user.completionRate || 0,
        totalGoals: user.totalGoals || 0,
        activeGoals: user.activeGoals || 0,
      });
    }
  };

  const loadBadges = () => {
    const earnedBadges = [];

    if (isGuest) {
      const guestGoals = JSON.parse(localStorage.getItem("guestGoals") || "[]");
      const guestNotes = JSON.parse(localStorage.getItem("guestNotes") || "[]");

      // Early Riser Badge - check if any notes/goals were logged before 8 AM
      const earlyMorningNotes = guestNotes.filter((note) => {
        const noteDate = new Date(note.createdAt || note.date);
        return noteDate.getHours() < 8;
      });

      if (earlyMorningNotes.length >= 5) {
        earnedBadges.push({
          name: "Early Riser",
          icon: "🌅",
          desc: "Logged 5 entries before 8AM",
        });
      }

      // Consistency Badge
      if (stats.longestStreak >= 7) {
        earnedBadges.push({
          name: "Week Warrior",
          icon: "🔥",
          desc: `Achieved ${stats.longestStreak}-day streak`,
        });
      }

      // Goal Achiever Badge
      if (stats.totalCompletions >= 10) {
        earnedBadges.push({
          name: "Goal Crusher",
          icon: "🎯",
          desc: `Completed ${stats.totalCompletions} goals`,
        });
      }

      // Note Taker Badge
      if (guestNotes.length >= 20) {
        earnedBadges.push({
          name: "Journaler",
          icon: "📝",
          desc: `Written ${guestNotes.length} journal entries`,
        });
      }

      // Perfectionist Badge
      if (stats.completionRate >= 90 && stats.totalGoals >= 10) {
        earnedBadges.push({
          name: "Perfectionist",
          icon: "💎",
          desc: `${stats.completionRate}% completion rate`,
        });
      }
    } else if (user && user.badges) {
      // For authenticated users, load badges from backend
      earnedBadges.push(...user.badges);
    }

    setBadges(earnedBadges);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile modal
    alert("Edit profile feature coming soon!");
  };

  const handleAvatarChange = () => {
    // TODO: Implement avatar upload
    alert("Avatar upload feature coming soon!");
  };

  const displayStats = [
    {
      label: "Longest Streak",
      value: `${stats.longestStreak} Days`,
      icon: <Zap className="text-yellow-400" size={20} />,
    },
    {
      label: "Total Completions",
      value: stats.totalCompletions.toLocaleString(),
      icon: <CheckCircle2 className="text-emerald-400" size={20} />,
    },
    {
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: <TrendingUp className="text-fuchsia-400" size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuchsia-500/30 p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Breadcrumbs />

        {/* --- HEADER SECTION --- */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-gray-400">
            {isGuest
              ? "Viewing locally stored data. Sign up to sync across devices!"
              : "Manage your account and view your progress."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT COLUMN: IDENTITY CARD (4 cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            {/* User Card */}
            <div className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/20 via-transparent to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="bg-[#0A0A0A] rounded-[22px] p-6 relative z-10 h-full">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                        {profileData.avatarUrl ? (
                          <img
                            src={profileData.avatarUrl}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={40} className="text-gray-400" />
                        )}
                        {/* Edit Overlay */}
                        <div
                          onClick={handleAvatarChange}
                          className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        >
                          <Camera size={20} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0 right-0 bg-emerald-500 border-4 border-[#0A0A0A] w-6 h-6 rounded-full"
                      title="Online"
                    ></div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-1">{profileData.name}</h2>
                  <p className="text-fuchsia-400 font-medium text-sm mb-4">
                    {isGuest ? "👤 Guest Mode" : profileData.email}
                  </p>

                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {profileData.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Joined {profileData.joinDate}
                    </span>
                  </div>

                  {/* Level Progress */}
                  <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5 mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Level {profileData.level}
                      </span>
                      <span className="text-xs font-mono text-fuchsia-400">
                        {profileData.xp} / {profileData.nextLevelXp} XP
                      </span>
                    </div>
                    <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-fuchsia-600 to-violet-600 rounded-full transition-all duration-500"
                        style={{ width: `${(profileData.xp / profileData.nextLevelXp) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={handleEditProfile}
                      className="flex-1 py-2.5 rounded-lg bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-2.5 rounded-lg bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} /> {isGuest ? "Sign In" : "Logout"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-3">
              {displayStats.map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                      {stat.icon}
                    </div>
                    <span className="text-sm text-gray-400 font-medium">{stat.label}</span>
                  </div>
                  <span className="text-lg font-bold text-white font-mono">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 border border-fuchsia-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">Active Goals</span>
                <Target className="text-fuchsia-400" size={18} />
              </div>
              <div className="text-3xl font-bold text-white">{stats.activeGoals}</div>
              <div className="text-xs text-gray-400 mt-1">of {stats.totalGoals} total</div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: TABS & CONTENT (8 cols) --- */}
          <div className="lg:col-span-8">
            {/* Custom Tabs */}
            <div className="flex gap-6 border-b border-white/10 mb-8 overflow-x-auto">
              {["Overview", "Account", "Settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                    activeTab === tab.toLowerCase()
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-fuchsia-500 shadow-[0_0_10px_#d946ef]"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "overview" && (
                <>
                  {/* 1. BADGES SECTION */}
                  <section>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white">Earned Badges</h3>
                      <span className="text-xs text-gray-500">{badges.length} earned</span>
                    </div>
                    {badges.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {badges.map((badge, i) => (
                          <div
                            key={i}
                            className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5 transition-all text-center cursor-pointer"
                          >
                            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                              {badge.icon}
                            </div>
                            <div className="font-bold text-white text-sm mb-1">{badge.name}</div>
                            <div className="text-[10px] text-gray-500 leading-tight">
                              {badge.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <Award className="mx-auto mb-4 text-gray-600" size={48} />
                        <p className="text-gray-400 text-sm">
                          No badges earned yet. Keep tracking to unlock achievements!
                        </p>
                      </div>
                    )}
                  </section>

                  {/* Activity Summary */}
                  <section>
                    <h3 className="text-lg font-bold text-white mb-4">Activity Summary</h3>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-3xl font-bold text-white mb-1">
                            {stats.totalGoals}
                          </div>
                          <div className="text-sm text-gray-400">Total Goals</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-emerald-400 mb-1">
                            {stats.totalCompletions}
                          </div>
                          <div className="text-sm text-gray-400">Completed</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-fuchsia-400 mb-1">
                            {stats.activeGoals}
                          </div>
                          <div className="text-sm text-gray-400">In Progress</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-yellow-400 mb-1">
                            {stats.longestStreak}
                          </div>
                          <div className="text-sm text-gray-400">Best Streak</div>
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeTab === "account" && (
                <section>
                  <h3 className="text-lg font-bold text-white mb-4">Account Information</h3>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl divide-y divide-white/5">
                    <div className="p-5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                        Full Name
                      </label>
                      <div className="text-white font-medium">{profileData.name}</div>
                    </div>

                    <div className="p-5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                        Email Address
                      </label>
                      <div className="text-white font-medium">{profileData.email}</div>
                    </div>

                    <div className="p-5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                        Location
                      </label>
                      <div className="text-white font-medium">{profileData.location}</div>
                    </div>

                    <div className="p-5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                        Member Since
                      </label>
                      <div className="text-white font-medium">{profileData.joinDate}</div>
                    </div>

                    {isGuest && (
                      <div className="p-5 bg-fuchsia-500/5 border-t border-fuchsia-500/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-white mb-1">
                              Guest Mode Active
                            </div>
                            <div className="text-xs text-gray-400">
                              Sign up to sync your data across devices
                            </div>
                          </div>
                          <button
                            onClick={() => navigate("/signup")}
                            className="px-4 py-2 rounded-lg bg-fuchsia-500 text-white text-sm font-bold hover:bg-fuchsia-600 transition-colors"
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === "settings" && (
                <>
                  {/* 2. GENERAL SETTINGS */}
                  <section>
                    <h3 className="text-lg font-bold text-white mb-4">General Preferences</h3>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl divide-y divide-white/5">
                      <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">Profile Visibility</div>
                            <div className="text-xs text-gray-500">
                              Make your progress public to other users.
                            </div>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full shadow-sm"></div>
                        </div>
                      </div>

                      <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                            <Bell size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">Daily Reminders</div>
                            <div className="text-xs text-gray-500">
                              Receive notifications at 9:00 AM daily.
                            </div>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full shadow-sm"></div>
                        </div>
                      </div>

                      {!isGuest && (
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                              <Shield size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">
                                Two-Factor Authentication
                              </div>
                              <div className="text-xs text-gray-500">
                                Add an extra layer of security.
                              </div>
                            </div>
                          </div>
                          <button className="px-4 py-1.5 rounded-lg border border-white/10 text-xs font-medium hover:bg-white/5 transition-colors">
                            Enable
                          </button>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* 3. DANGER ZONE */}
                  {!isGuest && (
                    <section>
                      <h3 className="text-lg font-bold text-red-500 mb-4">Danger Zone</h3>
                      <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-white">Delete Account</div>
                          <div className="text-xs text-gray-500">
                            Permanently remove your account and all data.
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-bold hover:bg-red-500/20 transition-colors border border-red-500/20">
                          Delete Account
                        </button>
                      </div>
                    </section>
                  )}

                  {isGuest && (
                    <section>
                      <h3 className="text-lg font-bold text-yellow-500 mb-4">Local Data</h3>
                      <div className="p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-sm font-bold text-white">Clear Local Data</div>
                            <div className="text-xs text-gray-500">
                              Remove all locally stored goals and notes.
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure? This will delete all your local data.")) {
                                localStorage.removeItem("guestGoals");
                                localStorage.removeItem("guestNotes");
                                localStorage.removeItem("guestProfile");
                                window.location.reload();
                              }
                            }}
                            className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-500 text-sm font-bold hover:bg-yellow-500/20 transition-colors border border-yellow-500/20"
                          >
                            Clear Data
                          </button>
                        </div>
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
