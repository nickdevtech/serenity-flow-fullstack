import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PlusCircle,
  FileText,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
  BookOpen,
} from "lucide-react";

const MyStudioPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("drafts");
  const { user } = useAuth();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/sessions/my-sessions/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (session) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/sessions/my-sessions/${session._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setSessions(sessions.filter((s) => s._id !== session._id));
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session");
    }
  };

  const draftSessions = sessions.filter((s) => s.status === "draft");
  const publishedSessions = sessions.filter((s) => s.status === "published");

  const categoryColors = {
    yoga: "bg-purple-100 text-purple-800",
    meditation: "bg-blue-100 text-blue-800",
    breathwork: "bg-cyan-100 text-cyan-800",
    mindfulness: "bg-green-100 text-green-800",
    movement: "bg-orange-100 text-orange-800",
    relaxation: "bg-pink-100 text-pink-800",
  };

  const SessionCard = ({ session, onDelete }) => (
    <div
      className={`relative bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden border ${
        session.status === "draft" ? "border-amber-300" : "border-transparent"
      }`}
    >
      <div className="h-40 bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center relative">
        {session.image_url ? (
          <img
            src={session.image_url}
            alt={session.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-5xl text-sage-300">🧘</div>
        )}
        {session.status === "draft" && (
          <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-medium">
            Draft
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">{session.title}</h3>
        <p className="text-gray-600 text-sm mt-1 mb-3 line-clamp-2">
          {session.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
          {session.category && (
            <span
              className={`px-2 py-1 rounded ${
                categoryColors[session.category] || "bg-gray-100 text-gray-800"
              }`}
            >
              {session.category}
            </span>
          )}
          {session.difficulty && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {session.difficulty}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/session-editor/${session._id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition">
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </Link>
          <button
            onClick={() => onDelete(session)}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const StudioStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {[
        {
          label: "Total Sessions",
          value: sessions.length,
          icon: BookOpen,
          color: "text-sage-500",
        },
        {
          label: "Published",
          value: publishedSessions.length,
          icon: Eye,
          color: "text-green-500",
        },
        {
          label: "Drafts",
          value: draftSessions.length,
          icon: FileText,
          color: "text-amber-500",
        },
      ].map(({ label, value, icon: Icon, color }, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
        >
          <div>
            <p className="text-sm text-sage-500 font-medium">{label}</p>
            <p className="text-3xl font-bold text-sage-800">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin mx-auto" />
          <p className="text-sage-600 text-sm">Loading your studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 space-y-10 bg-sage-50">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center items-center gap-2">
          <Sparkles className="w-6 h-6 text-sage-600" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sage-800 to-sage-600">
            My Studio
          </h1>
          <Sparkles className="w-6 h-6 text-sage-600" />
        </div>
        <p className="text-sage-600 text-lg">
          Create, manage, and share your wellness sessions with the world
        </p>
      </div>

      {/* Stats */}
      <StudioStats />

      {/* Create Session */}
      <div className="flex justify-center">
        <Link to="/session-editor">
          <button className="flex bg-red-600 items-center gap-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:shadow-lg transition">
            <PlusCircle className="w-5 h-5" />
            Create New Session
          </button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl shadow p-1 flex gap-1">
          {[
            { label: "Drafts", value: draftSessions.length, icon: FileText },
            { label: "Published", value: publishedSessions.length, icon: Eye },
          ].map(({ label, value, icon: Icon }, i) => {
            const tab = label.toLowerCase();
            const isActive = activeTab === tab;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 flex items-center gap-2 rounded-lg transition font-medium ${
                  isActive
                    ? "bg-sage-100 text-sage-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label} ({value})
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {(activeTab === "drafts" ? draftSessions : publishedSessions).length >
        0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "drafts" ? draftSessions : publishedSessions).map(
              (session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  onDelete={handleDelete}
                />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
            {activeTab === "drafts" ? (
              <>
                <BookOpen className="w-14 h-14 text-sage-400 mx-auto" />
                <h3 className="text-xl font-semibold text-sage-700">
                  No drafts yet
                </h3>
                <p className="text-sage-600">
                  Start creating your first session today.
                </p>
              </>
            ) : (
              <>
                <Eye className="w-14 h-14 text-sage-400 mx-auto" />
                <h3 className="text-xl font-semibold text-sage-700">
                  No published sessions
                </h3>
                <p className="text-sage-600">
                  Publish sessions to make them visible to others.
                </p>
              </>
            )}
            <Link to="/session-editor">
              <button className="mt-4 bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto">
                <PlusCircle className="w-4 h-4" />
                Create Session
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStudioPage;
