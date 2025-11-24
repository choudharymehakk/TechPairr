import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Calendar, Award, BookOpen, Briefcase } from 'lucide-react';
import { getProfile } from '../services/api';

export default function ProfileView() {
  const { userType, userId } = useParams<{ userType: string; userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [userType, userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!userType || !userId) {
        setError('Invalid profile URL');
        return;
      }

      const response = await getProfile(userType, userId);
      if (response.data.status === 'success') {
        setProfile(response.data.data);
        // Fetch user info (you might need to add this to your API)
        // For now, we'll use what's in the profile
      } else {
        setError('Profile not found');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">{error || 'Profile not found'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Explore</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className={`h-32 ${
            userType === 'student' 
              ? 'bg-gradient-to-r from-indigo-500 to-blue-600'
              : userType === 'faculty'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
              : 'bg-gradient-to-r from-orange-500 to-pink-600'
          }`}></div>
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-lg">
                {userType === 'student' ? '🎓' : userType === 'faculty' ? '👨‍🏫' : '💼'}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.user?.full_name || 'User Profile'}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              {userType === 'student' && (
                <>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Year {profile.year_of_study} - {profile.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>CGPA: {profile.cgpa || 'N/A'}</span>
                  </div>
                </>
              )}

              {userType === 'faculty' && (
                <>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{profile.designation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.department}</span>
                  </div>
                </>
              )}

              {userType === 'industry' && (
                <>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{profile.position} at {profile.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{profile.years_experience} years experience</span>
                  </div>
                </>
              )}
            </div>

            {profile.bio && (
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Skills/Expertise/Research Areas */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {userType === 'student' ? 'Skills' : 
             userType === 'faculty' ? 'Expertise & Research Areas' : 
             'Expertise & Focus Areas'}
          </h2>

          {userType === 'student' && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills?.map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-700 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </>
          )}

          {userType === 'faculty' && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.expertise?.map((item: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-700 mb-2">Research Areas</h3>
              <div className="flex flex-wrap gap-2">
                {profile.research_areas?.map((area: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </>
          )}

          {userType === 'industry' && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.expertise?.map((item: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-700 mb-2">Mentoring Focus</h3>
              <div className="flex flex-wrap gap-2">
                {profile.mentoring_focus?.map((focus: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {focus}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-4">
            <a
              href={`mailto:${profile.user?.email || ''}?subject=Connect on Mentora&body=Hi ${profile.user?.full_name || ''},%0D%0A%0D%0AI found your profile on Mentora and would love to connect!%0D%0A%0D%0ABest regards`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              <Mail className="w-5 h-5 inline mr-2" />
              Send Email
            </a>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              {userType === 'student' ? 'Offer Mentorship' : 'Request Mentorship'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
