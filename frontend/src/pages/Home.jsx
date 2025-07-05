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
          backgroundAttachment: 'fixed'
        }}
        className="flex items-center justify-center relative px-4 h-[100dvh] overflow-hidden pt-[5vh] md:pt-0"
      >
        {/* Translucent Overlay */}
        <div className="absolute inset-0 bg-[#DFFFE3]/10 backdrop-blur-xs"></div>

        {/* Cards Container */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-12 flex-wrap max-w-[90%] mx-auto h-[90%] overflow-y-auto">

          {/* Welcome Card */}
          <motion.div
            layout
            animate={{ gap: activeCard !== 'welcome' ? '5%' : '0%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="bg-[#DFFFE3]/20 backdrop-blur p-6 md:p-8 rounded-2xl text-center w-full max-w-sm sm:max-w-md md:max-w-lg min-h-[220px] max-h-[90%] overflow-auto shadow flex flex-col justify-center"
          >
            <h1 className="text-3xl md:text-4xl text-[#2F3E2E] font-bold mb-3">
              Your feedback can shape LDCE — will you join?
            </h1>
            <h2 className="text-md md:text-lg text-gray-700 mb-3">Your experiences can make a real difference with Campus Connect. Be the voice that counts.</h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-[#3A8F50] hover:bg-[#A3D977] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                onClick={() => setActiveCard('signup')}
              >
                Signup Now!
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
                className="bg-[#DFFFE3]/50 backdrop-blur p-6 md:p-8 rounded-2xl text-center w-[400px] h-[440px] shadow flex flex-col justify-center"
              >
                <h2 className="text-2xl md:text-3xl text-[#2F3E2E] font-bold mb-4">Sign Up</h2>
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
                className="bg-[#DFFFE3]/50 backdrop-blur p-6 md:p-8 rounded-2xl text-center w-[400px] h-[440px] shadow flex flex-col justify-center"
              >
                <h2 className="text-2xl md:text-3xl text-[#2F3E2E] font-bold mb-4">Login</h2>
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
      <div className="w-full py-20 px-4 bg-[#DFFFE3]">
        <div
          ref={aboutRef}
          className="w-full max-w-[95%] md:max-w-[85%] lg:max-w-[75%] mx-auto flex flex-col md:flex-row items-center md:items-center justify-between gap-6"
        >
          {/* Animated Counters */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
            className="flex flex-col gap-6 md:gap-8 w-full md:flex-1 items-center md:items-start"
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
          <div className="relative w-full md:flex-1 max-w-[90%] sm:max-w-[28rem] md:max-w-[36rem] lg:max-w-[44rem] bg-[#FAFAF5] backdrop-blur rounded-xl shadow hover:shadow-xl flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden max-h-[90%] min-h-[200px]">
            {highlights.length > 0 && (
              <motion.div
                key={currentIndex}
                onClick={() => navigate('/feedbacks')}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="text-center overflow-y-auto max-h-[70vh]"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{highlights[currentIndex].title}</h3>
                <p className="text-lg sm:text-2xl font-bold italic text-gray-800 mb-4 line-clamp-4">“{highlights[currentIndex].comment}”</p>
                <p className="text-sm mb-1">Rating: {highlights[currentIndex].rating} / 5</p>
                {highlights[currentIndex].is_anonymous ? null : (
                  <p className="text-sm">By {highlights[currentIndex].username}</p>
                )}
              </motion.div>
            )}

            {/* Manual Controls */}
            <button
              className="absolute left-4 text-2xl font-bold text-gray-600 hover:bg-[#3A8F50]/15 bg-[#DFFFE3]/40 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow transition-colors"
              onClick={() =>
                setCurrentIndex((prevIndex) =>
                  prevIndex === 0 ? highlights.length - 1 : prevIndex - 1
                )
              }
            >
              ‹
            </button>
            <button
              className="absolute right-4 text-2xl font-bold text-gray-600 hover:bg-[#3A8F50]/15 bg-[#DFFFE3]/40 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow transition-colors"
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
