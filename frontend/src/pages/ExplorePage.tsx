import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, TrendingUp, Filter } from 'lucide-react';
import { getExploreMatches } from '../services/api';
import MentorshipRequestModal from '../components/MentorshipRequestModal';

interface MatchResult {
  type: string;
  match: number;
  why: string[];
  // For mentors/students
  profile?: any;
  user?: {
    full_name: string;
    email: string;
  };
  // For projects
  project?: any;
  creator?: {
    full_name: string;
    email: string;
  };
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'mentors', 'students', 'projects'
    minMatch: 0,
    searchQuery: ''
  });
  const [filteredResults, setFilteredResults] = useState<MatchResult[]>([]);
  
  // Mentorship modal state
  const [mentorshipModal, setMentorshipModal] = useState<{
    isOpen: boolean;
    recipientId: string;
    recipientName: string;
    recipientType: 'student' | 'faculty' | 'industry';
    requestType: 'student_to_mentor' | 'mentor_to_student';
  }>({
    isOpen: false,
    recipientId: '',
    recipientName: '',
    recipientType: 'faculty',
    requestType: 'student_to_mentor'
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  // Filter results whenever filters or results change
  useEffect(() => {
    let filtered = [...results];
    
    // Filter by type
    if (filters.type !== 'all') {
      if (filters.type === 'mentors') {
        filtered = filtered.filter(r => r.type === 'faculty' || r.type === 'industry');
      } else if (filters.type === 'students') {
        filtered = filtered.filter(r => r.type === 'student');
      } else if (filters.type === 'projects') {
        filtered = filtered.filter(r => r.type === 'project');
      }
    }
    
    // Filter by minimum match percentage
    if (filters.minMatch > 0) {
      filtered = filtered.filter(r => r.match >= filters.minMatch);
    }
    
    // Filter by search query (name, skills, etc.)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        if (r.type === 'project') {
          return r.project?.title?.toLowerCase().includes(query) ||
                 r.project?.description?.toLowerCase().includes(query) ||
                 r.creator?.full_name?.toLowerCase().includes(query);
        } else {
          return r.user?.full_name?.toLowerCase().includes(query) ||
                 r.profile?.bio?.toLowerCase().includes(query) ||
                 r.profile?.skills?.some((s: string) => s.toLowerCase().includes(query)) ||
                 r.profile?.research_areas?.some((a: string) => a.toLowerCase().includes(query)) ||
                 r.profile?.expertise?.some((e: string) => e.toLowerCase().includes(query)) ||
                 r.profile?.mentoring_focus?.some((f: string) => f.toLowerCase().includes(query));
        }
      });
    }
    
    setFilteredResults(filtered);
  }, [results, filters]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('Please log in to see matches');
        return;
      }
      
      const userData = JSON.parse(userStr);
      if (!userData.id) {
        setError('User ID not found. Please log in again.');
        return;
      }
      
      const response = await getExploreMatches(userData.id);
      
      if (response.data.status === 'success') {
        setResults(response.data.results);
      } else {
        setError(response.data.message || 'Failed to load matches');
      }
    } catch (err: any) {
      console.error('Error fetching matches:', err);
      setError(err.response?.data?.message || 'Failed to load matches. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (result: MatchResult) => {
    if (result.type === 'project') {
      navigate(`/project/${result.project?.id}`);
    } else {
      const profileType = result.type;
      const userId = result.profile?.user_id;
      navigate(`/profile/${profileType}/${userId}`);
    }
  };

  const handleApplyToProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleMentorshipAction = (result: MatchResult) => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const isStudentRequesting = userData.user_type === 'student' && result.type !== 'student';
    
    setMentorshipModal({
      isOpen: true,
      recipientId: result.profile?.user_id || '',
      recipientName: result.user?.full_name || '',
      recipientType: result.type as 'student' | 'faculty' | 'industry',
      requestType: isStudentRequesting ? 'student_to_mentor' : 'mentor_to_student'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding your matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">{error}</p>
          <button 
            onClick={fetchMatches}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Search className="w-8 h-8 text-blue-600" />
            Explore Matches
          </h1>
          <p className="mt-2 text-gray-600">
            Discover mentors, students, and projects based on your profile
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                placeholder="Name, skills, interests..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Results</option>
                <option value="mentors">Mentors Only</option>
                <option value="students">Students Only</option>
                <option value="projects">Projects Only</option>
              </select>
            </div>
            
            {/* Match Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Match: {filters.minMatch}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minMatch}
                onChange={(e) => setFilters({ ...filters, minMatch: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Clear Filters */}
          {(filters.type !== 'all' || filters.minMatch > 0 || filters.searchQuery) && (
            <button
              onClick={() => setFilters({ type: 'all', minMatch: 0, searchQuery: '' })}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          <span className="font-medium">{filteredResults.length} matches found</span>
        </div>

        {/* Results Grid */}
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or updating your profile
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResults.map((result, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Render Mentor/Student Card */}
                {result.type !== 'project' && (
                  <>
                    {/* Match Badge */}
                    <div className={`px-4 py-3 flex items-center justify-between ${
                      result.type === 'student' 
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}>
                      <div>
                        <span className="text-white font-semibold block">
                          {result.user?.full_name}
                        </span>
                        <span className="text-white/80 text-xs">
                          {result.type === 'faculty' ? '👨‍🏫 Faculty' : 
                           result.type === 'industry' ? '💼 Industry Mentor' : 
                           '🎓 Student'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <TrendingUp className="w-4 h-4 text-white" />
                        <span className="text-white font-bold">{result.match}%</span>
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          {result.type === 'faculty' 
                            ? result.profile?.designation 
                            : result.type === 'industry'
                            ? result.profile?.position
                            : `Year ${result.profile?.year_of_study} - ${result.profile?.department}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.type === 'faculty' 
                            ? result.profile?.department 
                            : result.type === 'industry'
                            ? result.profile?.company
                            : `CGPA: ${result.profile?.cgpa || 'N/A'}`}
                        </p>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {result.profile?.bio || 'No bio available'}
                      </p>

                      {/* Why Matched */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Why you matched:
                        </h4>
                        <div className="space-y-1">
                          {result.why.map((reason, i) => (
                            <p key={i} className="text-sm text-green-600 flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{reason}</span>
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Skills/Research/Focus Areas */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          {result.type === 'faculty' ? 'Research Areas:' : 
                           result.type === 'industry' ? 'Focus Areas:' : 
                           'Skills:'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(result.type === 'faculty' 
                            ? result.profile?.research_areas 
                            : result.type === 'industry'
                            ? result.profile?.mentoring_focus
                            : result.profile?.skills
                          )?.slice(0, 3).map((item: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleViewDetails(result)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={() => handleMentorshipAction(result)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {result.type === 'student' ? 'Offer Mentorship' : 'Request Mentorship'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Render Project Card */}
                {result.type === 'project' && (
                  <>
                    {/* Match Badge */}
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 px-4 py-3 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <span className="text-white font-semibold block truncate">
                          {result.project?.title}
                        </span>
                        <span className="text-white/80 text-xs">
                          {result.project?.creator_type === 'faculty' ? '🎓 Faculty Project' : 
                           result.project?.creator_type === 'industry' ? '💼 Industry Project' : 
                           '👨‍💻 Student Project'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex-shrink-0 ml-2">
                        <TrendingUp className="w-4 h-4 text-white" />
                        <span className="text-white font-bold">{result.match}%</span>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          By {result.creator?.full_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {result.project?.duration} | {result.project?.time_commitment_hours}hrs/week
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {result.project?.description || 'No description available'}
                      </p>

                      {/* Why Matched */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Why you matched:
                        </h4>
                        <div className="space-y-1">
                          {result.why.map((reason, i) => (
                            <p key={i} className="text-sm text-green-600 flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{reason}</span>
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Required Skills */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Required Skills:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.project?.required_skills?.slice(0, 3).map((skill: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleViewDetails(result)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => handleApplyToProject(result.project?.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Apply to Project
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mentorship Request Modal */}
      <MentorshipRequestModal
        isOpen={mentorshipModal.isOpen}
        onClose={() => setMentorshipModal({ ...mentorshipModal, isOpen: false })}
        recipientId={mentorshipModal.recipientId}
        recipientName={mentorshipModal.recipientName}
        recipientType={mentorshipModal.recipientType}
        requestType={mentorshipModal.requestType}
      />
    </div>
  );
}
