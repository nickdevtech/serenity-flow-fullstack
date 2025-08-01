import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Clock, User, Play, Heart, Sparkles } from "lucide-react";

const DashboardPage = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "yoga", label: "Yoga" },
    { value: "meditation", label: "Meditation" },
    { value: "breathwork", label: "Breathwork" },
    { value: "mindfulness", label: "Mindfulness" },
    { value: "movement", label: "Movement" },
    { value: "relaxation", label: "Relaxation" },
  ];

  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, selectedCategory, selectedDifficulty]);

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions.filter((session) => {
      const matchesSearch =
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        session.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || session.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "all" ||
        session.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    setFilteredSessions(filtered);
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const SessionCard = ({ session, featured = false }) => {
    const categoryColors = {
      yoga: "bg-purple-100 text-purple-800",
      meditation: "bg-blue-100 text-blue-800",
      breathwork: "bg-cyan-100 text-cyan-800",
      mindfulness: "bg-green-100 text-green-800",
      movement: "bg-orange-100 text-orange-800",
      relaxation: "bg-pink-100 text-pink-800",
    };

    const difficultyColors = {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-yellow-100 text-yellow-700",
      advanced: "bg-red-100 text-red-700",
    };

    return (
      <div
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
          featured ? "ring-2 ring-gray-200" : ""
        }`}
      >
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          {session.image_url ? (
            <img
              src={session.image_url}
              alt={session.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-300" />
            </div>
          )}
          {featured && (
            <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            {session.title}
          </h3>
          {session.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {session.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            {session.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{session.duration}min</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{session.created_by?.full_name || "Anonymous"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {session.category && (
              <span
                className={`px-2 py-1 rounded text-xs ${
                  categoryColors[session.category] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {session.category}
              </span>
            )}
            <span
              className={`px-2 py-1 rounded text-xs ${
                difficultyColors[session.difficulty] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {session.difficulty}
            </span>
          </div>

          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {session.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {session.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  +{session.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <button
            onClick={() => {
              if (session.json_file_url) {
                window.open(session.json_file_url, "_blank");
              } else {
                alert("No session URL available");
              }
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Session
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading wellness sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {getWelcomeMessage()},{" "}
          {user?.full_name?.split(" ")[0] || "Wellness Seeker"}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Discover transformative wellness sessions crafted by our community of
          practitioners
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for yoga, meditation, breathwork..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 focus:border-gray-400 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-800">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.value
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-800">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.value}
                onClick={() => setSelectedDifficulty(difficulty.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedDifficulty === difficulty.value
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {difficulty.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredSessions.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Sessions
            </h2>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredSessions.slice(0, 3).map((session) => (
              <SessionCard key={session._id} session={session} featured />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">
            All Sessions ({filteredSessions.length})
          </h2>
        </div>

        {filteredSessions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredSessions.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <Heart className="w-16 h-16 text-gray-400 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-700">
              No sessions found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search or filters to discover more wellness
              sessions
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
