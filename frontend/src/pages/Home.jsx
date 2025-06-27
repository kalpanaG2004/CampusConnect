import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHighlights, fetchSummary, fetchTeasers } from '../api/analytics';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Signup from './Signup';
import Login from './Login';
import FeedbackPieChart from '../components/PieChart';

function Home() {
  const navigate = useNavigate();
  const [highlights, setHighlights] = useState([]);
  const [summary, setSummary] = useState({ total_feedbacks: 0, total_users: 0, category_counts: {} });
  const [teasers, setTeasers] = useState([]);
  const [activeCard, setActiveCard] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function getAnalytics() {
      const fetchedHighlights = await fetchHighlights();
      const fetchedSummary = await fetchSummary();
      setHighlights(fetchedHighlights);
      setSummary(fetchedSummary);
    }
    getAnalytics();
  }, []);

  useEffect(() => {
    async function getTeasers() {
      const fetchedTeasers = await fetchTeasers();
      setTeasers(fetchedTeasers);
    }
    getTeasers();
  }, []);

  // Auto-Rotation
  useEffect(() => {
    if (highlights.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % highlights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [highlights]);

  const aboutRef = useRef(null);
  const isInView = useInView(aboutRef, { once: false, margin: '-100px' });
  const categoryDescriptions = {
    faculty: 'Share your classroom experiences and teaching feedback.',
    event: 'Voice your thoughts about college events and gatherings.',
    club: 'Reflect on club activities and initiatives.',
    infrastructure: 'Provide feedback on facilities and campus resources.',
    other: 'Share anything that doesn’t fit the usual categories.'
  };

  const pieChartData = Object.entries(summary.category_counts).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count
  }));


  return (
    <div className="p-0 m-0">
      {/* 🌟 Fixed Background Section */}
      <div
        style={{
          backgroundImage: "url('/images/lawn.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          height: '100vh'
        }}
        className="flex items-center justify-center relative"
      >
        {/* Translucent Overlay */}
        <div className="absolute inset-0 bg-[#DFFFE3]/10 backdrop-blur-xs"></div>
        {/* Cards Container */}
        <div className="flex gap-12 flex-wrap justify-center items-center">
          {/* Welcome Card */}
          <motion.div
            layout
            animate={{ x: activeCard === 'signup' || activeCard === 'login' ? -40 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-white/1 backdrop-blur p-8 rounded-2xl text-center w-[400px] h-[240px] shadow flex flex-col justify-center"
          >
            <h1 className="text-4xl text-[#2F3E2E] font-bold mb-3">
              Welcome to Campus Connect
            </h1>
            <h2 className="text-lg text-gray-700 mb-3">Building a stronger LDCE community together.</h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#3A8F50] hover:bg-[#A3D977] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                onClick={() => setActiveCard('signup')}
              >
                Join Us Now!
              </button>
            </div>
          </motion.div>

          {/* AnimatePresence for Dynamic Card */}
          <AnimatePresence mode="wait">
            {activeCard === 'signup' && (
              <motion.div
                key="signup"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/1 backdrop-blur p-8 rounded-2xl text-center w-[400px] h-[440px] shadow flex flex-col justify-center"
              >
                <h2 className="text-3xl text-[#2F3E2E] font-bold mb-4">Sign Up</h2>
                <Signup onSuccess={() => setActiveCard('login')} />
                <p className="mt-4 text-sm">
                  Already registered?{' '}
                  <span
                    className="text-[#3A8F50] font-semibold cursor-pointer"
                    onClick={() => setActiveCard('login')}
                  >
                    Login
                  </span>
                </p>
              </motion.div>
            )}

            {activeCard === 'login' && (
              <motion.div
                key="login"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/1 backdrop-blur p-8 rounded-2xl text-center w-[400px] h-[440px] shadow flex flex-col justify-center"
              >
                <h2 className="text-3xl text-[#2F3E2E] font-bold mb-4">Login</h2>
                <Login />
                <p className="mt-4 text-sm">
                  New here?{' '}
                  <span
                    className="text-[#3A8F50] font-semibold cursor-pointer"
                    onClick={() => setActiveCard('signup')}
                  >
                    Sign Up
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Teaser Cards Section */}
      <div className="py-16 px-6 bg-[#8E9775] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-white mb-4 text-center max-w-4xl">
          Campus Connect gives you the space to share your voice across diverse categories.
        </h2>
        <p className="text-lg text-center text-white mb-12 max-w-4xl">
          From faculty insights to campus events, club experiences to infrastructure feedback — your experiences matter and help shape our LDCE community.
        </p>

        {/* Teaser Cards + Side Descriptions */}
        <div className="flex flex-col gap-10 max-w-7xl w-full">
          {teasers.map((teaser, index) => (
            <div
              key={index}
              onClick={() => navigate('/feedbacks')}
              className={`flex flex-col md:flex-row items-center gap-6 bg-white/10 p-4 rounded-xl hover:shadow-md ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                }`}
            >
              {/* Teaser Card */}
              <div className="bg-white/90 p-6 rounded-xl shadow hover:shadow-lg transition-all transform hover:-translate-y-2 w-full md:w-1/2">
                <h3 className="text-lg font-semibold mb-2 text-[#2F3E2E]">{teaser.title}</h3>
                <p className="text-gray-700 text-md italic line-clamp-4">“{teaser.comment}”</p>
              </div>

              {/* Mini Description on the Side */}
              <p className="text-white text-md max-w-[300px] md:w-1/2">
                {categoryDescriptions[teaser.category]}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          className="mt-12 bg-[#DFFFE3]/100 text-[#3A8F50] hover:bg-[#A3D977] hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          onClick={() => navigate('/feedbacks')}
        >
          View All Feedbacks
        </button>
      </div>

      {/* Counters + Carousel Section */}
      <div
        ref={aboutRef}
        className="w-full py-20 px-10 bg-[#DFFFE3] flex flex-col md:flex-row items-center justify-center md:px-60 gap-16"
      >
        {/* Animated Counters */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          className="flex flex-col gap-6 md:gap-8 w-full md:w-1/2 items-center md:items-start"
        >
          <div className="flex flex-col md:flex-row gap-8 flex-wrap items-center justify-center md:justify-start">

            {/* Total Feedbacks */}
            <div className="text-center">
              <h3 className="text-7xl font-bold text-[#3A8F50]">
                {summary.total_feedbacks}+
              </h3>
              <p className="mt-2 text-2xl font-semibold text-gray-700">Feedbacks Submitted</p>
            </div>

            {/* Total Users */}
            <div className="text-center">
              <h3 className="text-7xl font-bold text-[#3A8F50]">
                {summary.total_users}+
              </h3>
              <p className="mt-2 text-2xl font-semibold text-gray-700">Active Users</p>
            </div>
          </div>

          {/* Text Below Counters */}
          <p className="text-center md:text-left text-gray-700 text-lg italic mt-4 max-w-xl">
            Real voices. Real impact. Be the next one to speak up.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative w-full md:w-1/2 h-64 overflow-hidden bg-white/80 backdrop-blur rounded-xl shadow hover:shadow-xl flex items-center justify-center">
          {highlights.length > 0 && (
            <motion.div
              key={currentIndex}
              onClick={() => navigate('/feedbacks')}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="text-center p-8"
            >
              <h3 className="text-xl font-semibold mb-2">{highlights[currentIndex].title}</h3>
              <p className="text-2xl font-bold italic text-gray-800 mb-4 line-clamp-4">“{highlights[currentIndex].comment}”</p>
              <p className="text-sm mb-1">Rating: {highlights[currentIndex].rating} / 5</p>
              {highlights[currentIndex].is_anonymous ? null : (
                <p className="text-sm">By {highlights[currentIndex].username}</p>
              )}
            </motion.div>
          )}

          {/* Manual Controls */}
          <button
            className="absolute left-4 text-2xl font-bold text-gray-600 hover:bg-[#3A8F50]/15 bg-[#DFFFE3]/40 w-10 h-10 rounded-full flex items-center justify-center shadow transition-colors"
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? highlights.length - 1 : prevIndex - 1
              )
            }
          >
            ‹
          </button>
          <button
            className="absolute right-4 text-2xl font-bold text-gray-600 hover:bg-[#3A8F50]/15 bg-[#DFFFE3]/40 w-10 h-10 rounded-full flex items-center justify-center shadow transition-colors"
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % highlights.length
              )
            }
          >
            ›
          </button>
        </div>
      </div>

      {/* Pie Chart + Text + CTA Section */}
      <div className="w-full py-20 px-10 bg-[#DFFFE3] flex flex-col md:flex-row items-center justify-center md:px-20 gap-16">

        {/* Pie Chart */}
        <div className="w-full md:w-1/2 flex justify-center">
          <FeedbackPieChart data={pieChartData} />
        </div>

        {/* Text + CTA */}
        <div className="flex flex-col gap-6 text-center md:text-left w-full max-w-xs">
          <h2 className="text-4xl font-bold text-[#3A8F50]">Campus Buzz: See the Action</h2>
          <p className="text-gray-700 text-md">See which areas are buzzing with feedback and where your voice can make the biggest impact!</p>
          <p className="text-gray-700 text-md">Contribute to your category and help balance the conversation.</p>

          <button
            className="bg-[#3A8F50] hover:bg-[#A3D977] text-white hover:text-[#2F3E2E] px-6 py-2 rounded-lg font-semibold transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Join the Conversation
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
