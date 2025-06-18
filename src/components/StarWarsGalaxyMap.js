import { useState, useEffect, useRef } from 'react';
import CustomSelect from './CustomSelect';
import useClickSound from './PlaySound';

const generateStars = (count = 100) => {
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 2 + 0.5}px`,
    height: `${Math.random() * 2 + 0.5}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 3 + 2}s`
  }));
};

const StarWarsGalaxyMap = () => {
  const [stars, setStars] = useState(() => generateStars());
  const [hoveredSystem, setHoveredSystem] = useState(null);
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const audioRef = useRef(null);
  const [quiz, setQuiz] = useState({
    currentQuestion: 0,
    score: 0,
    questions: [
      {
        question: "Which system was essentially sacred to jedi?",
        options: ["Chrelythiumn", "Coruscant", "Tython", "Korriban"],
        correct: 2
      },
      {
        question: "Which system was a birthplace of Luke Skywalker?",
        options: ["Alderaan", "Tatooine", "Dantooine", "Skarif"],
        correct: 1  
      },
      {
        question: "Which system was the capital of the Galactic Republic?",
        options: ["Hosnian", "Kamino", "Coruscant", "Geonosis"],
        correct: 2
      },
      {
        question: "Which system was homeworld of emperor Sheev Palpatine?",
        options: ["Exegol", "Korriban", "Mustafar", "Naboo"],
        correct: 3
      },
      {
        question: "Which system contained a 'portal' to a different realm?",
        options: ["Rakata", "Dagoba", "Chrelythiumn", "Csilla"],
        correct: 2
      },
      {
        question: "Which system was essentially sacred to sith?",
        options: ["Korriban", "Exegol", "Ahch-To", "Ilum"],
        correct: 0
      },
      {
        question: "Which system was completely destroyed by a super-weapon?",
        options: ["Alderaan", "Jedha", "Scarif", "Hosnian"],
        correct: 3
      },
      {
        question: "Which system featured in 'Andor' series?",
        options: ["Bothawui", "Aldhani", "Kijimi", "Dorin"],
        correct: 1
      },
      {
        question: "Which of these systems' main planets was not completely covered in water?",
        options: ["Kamino", "Manaan", "Kashyyyk", "Hoth"],
        correct: 2
      },
      {
        question: "Which system was not featured in 'SW: Solo' movie?",
        options: ["Morlani", "Vandor", "Corellia", "Kessel"],
        correct: 0
      }
    ],
    selectedAnswer: null,
    showResults: false,
    completed: false
  });
  
  const [selectedSurveyFaction, setSelectedSurveyFaction] = useState("");
  const [selectedSurveySystem, setSelectedSurveySystem] = useState("");
  const [selectedSurveyRank, setSelectedSurveyRank] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  const playSystemClick = useClickSound('/sounds/system_click.mp3', 0.3, 500);
  const playButtonClick = useClickSound('/sounds/button_click.mp3', 0.6, 500);
  const playCloseClick = useClickSound('/sounds/close_click.mp3', 0.1, 500);
  const playUpdateClick = useClickSound('/sounds/update_click.mp3', 0.2, 500);

  const factions = [
    "Jedi Order",
    "Sith Order",
    "Rebel Alliance",
    "Galactic Empire",
    "Galactic Republic",
  ];

  const factionRanks = {
  "Jedi Order": ["Youngling", "Padawan", "Knight", "Master"],
  "Sith Order": ["Acolyte", "Apprentice", "Warrior", "Lord"],
  "Rebel Alliance": ["Recruit", "Soldier", "Commander", "General"],
  "Galactic Empire": ["Stormtrooper", "ISB Agent", "Moff", "Emperor"],
  "Galactic Republic": ["Clone Trooper", "Clone Commando", "Senator", "Chancellor"]
};

  const systemPositions = {
    // Core Worlds
    "Alderaan": { x: 58, y: 42, region: 'Core Worlds' },
    "Coruscant": { x:48, y: 39, region: 'Core Worlds' },
    "Tython": { x: 47, y: 41, region: 'Core Worlds' },
    "Corellian": { x: 62, y: 49, region: 'Core Worlds' },
    "Hosnian": { x: 61, y: 55, region: 'Core Worlds' },
    
    // Inner Rim  
    "Naboo": { x: 62, y: 74, region: 'Inner Rim' },
    "Dorin": { x: 46, y: 27, region: 'Inner Rim' },
    "Ord Mantell": { x: 53, y: 24, region: 'Inner Rim' },
    "Onderon": { x: 66, y: 33, region: 'Inner Rim' },
    "Manaan": { x: 70, y: 45, region: 'Inner Rim' },
    "Circarpous": { x: 73, y: 52, region: 'Inner Rim' },
    "Vandor": { x: 71, y: 59, region: 'Inner Rim' },
    "Fondor": { x: 48, y: 72, region: 'Inner Rim' },
    
    // Mid Rim
    "Kashyyyk": { x: 77, y: 50, region: 'Mid Rim' },
    "Tatooine": { x: 76, y: 72, region: 'Mid Rim' },
    "Jakku": { x: 36, y: 54, region: 'Mid Rim' },
    "Kamino": { x: 78, y: 62, region: 'Mid Rim' },
    "Jedha": { x: 37.5, y: 39, region: 'Mid Rim' },
    "Iridonia": { x: 49, y: 21, region: 'Mid Rim' },
    "Taris": { x: 64, y: 19, region: 'Mid Rim' },
    "Mandalore": { x: 67, y: 21, region: 'Mid Rim' },
    "Yavin": { x: 70, y: 20, region: 'Mid Rim' },
    "Felucia": { x: 74, y: 24, region: 'Mid Rim' },
    "Kijimi": { x: 71, y: 28, region: 'Mid Rim' },
    "Korriban": { x: 78, y: 34, region: 'Mid Rim' },
    "Bothawui": { x: 76, y: 59, region: 'Mid Rim' },
    "Scarif": { x: 80, y: 65, region: 'Mid Rim' },
    "Savareen": { x: 73, y: 74, region: 'Mid Rim' },
    "D'Qar": { x: 63, y: 83, region: 'Mid Rim' },
    "Crait": { x: 60, y: 81, region: 'Mid Rim' },
    "Bespin": { x: 45, y: 78, region: 'Mid Rim' },
    "Sullust": { x: 57, y: 83, region: 'Mid Rim' },
    "Takodana": { x: 41, y: 73, region: 'Mid Rim' },
    
    // Outer Rim
    "Hoth": { x: 44, y: 80, region: 'Outer Rim' },
    "Dagobah": { x: 61, y: 88, region: 'Outer Rim' },
    "Endor": { x: 36, y: 61, region: 'Outer Rim' },
    "Mustafar": { x: 53, y: 88, region: 'Outer Rim' },
    "Mygeeto": { x: 49, y: 15, region: 'Outer Rim' },
    "Dantooine": { x: 51, y: 13.5, region: 'Outer Rim' },
    "Lah'Mu": { x: 57, y: 11, region: 'Outer Rim' },
    "Dathomir": { x: 67, y: 13, region: 'Outer Rim' },
    "Bogano": { x: 69, y: 11, region: 'Outer Rim' },
    "Telos": { x: 71, y: 14.5, region: 'Outer Rim' },
    "Zeffo": { x: 73, y: 13.5, region: 'Outer Rim' },
    "Cantonica": { x: 78, y: 20, region: 'Outer Rim' },
    "Mon Calamari": { x: 81, y: 26, region: 'Outer Rim' },
    "Lothal": { x: 83, y: 28, region: 'Outer Rim' },
    "Eadu": { x: 89, y: 46, region: 'Outer Rim' },
    "Koboh": { x: 83, y: 71, region: 'Outer Rim' },
    "Aldhani": { x: 81, y: 76, region: 'Outer Rim' },
    "Geonosis": { x: 78, y: 77, region: 'Outer Rim' },
    "Ryloth": { x: 79, y: 79, region: 'Outer Rim' },
    "Nevarro": { x: 75.5, y: 82, region: 'Outer Rim' },
    "Morlani": { x: 69, y: 85, region: 'Outer Rim' },
    "Utapau": { x: 66, y: 89, region: 'Outer Rim' },
    "Malachor": { x: 75.5, y: 17, region: 'Outer Rim' },

    // Hutt Space
    "Kafrene": { x: 82, y: 40, region: 'Hutt Space' },
    "Kessel": { x: 86, y: 42, region: 'Hutt Space' },
    "Toydaria": { x: 81, y: 55, region: 'Hutt Space' },
    "Nal Hutta": { x: 84, y: 60, region: 'Hutt Space' },
    
    // Unknown Regions
    "Ilum": { x: 28, y: 25, region: 'Unknown Regions' },
    "Exegol": { x:20 , y:26 , region: 'Unknown Regions' },
    "Csilla": { x:23 , y:34 , region: 'Unknown Regions' },
    "Rakata": { x:32 , y:44 , region: 'Unknown Regions' },
    "Ahch-To": { x:30 , y:57 , region: 'Unknown Regions' },

    // Wild Space
    "Dosuun": { x:39 , y:90 , region: 'Wild Space' },
    "Chrelythiumn": { x:36 , y:13 , region: 'Wild Space' }
  };

  const fetchSystems = async () => {
  try {
    setLoading(true);

    const MIN_SPIN_TIME = 1000;
    const startTime = Date.now();

    const response = await fetch('/systems.json');
    const data = await response.json();

    const timePassed = Date.now() - startTime;
    const timeRemaining = MIN_SPIN_TIME - timePassed;

    if (timeRemaining > 0) {
      await new Promise(resolve => setTimeout(resolve, timeRemaining));
    }

    setSystems(data);
    setStars(generateStars());
    setLoading(false);
  } catch (error) {
    console.error('Systems loading error:', error);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSystems();
    
    const interval = setInterval(() => {
      console.log('Updating data...');
      fetchSystems();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
    audioRef.current.volume = 0;
    audioRef.current.loop = true;
    }
  }, []);

  const validateLogin = () => {
    const errors = {};
    
    if (!loginForm.username.trim()) {
      errors.username = "Username must not be empty";
    } else if (loginForm.username.length < 3) {
      errors.username = "Username must contain 3 or more characters";
    }
    
    if (!loginForm.password.trim()) {
      errors.password = "Password must not be empty";
    } else if (loginForm.password.length < 6) {
      errors.password = "Password must contain 6 or more characters";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = () => {
    if (validateLogin()) {
      setUser({ username: loginForm.username});
      setShowLogin(false);
      setLoginForm({ username: '', password: '' });
    }
  };

  const handleQuizAnswer = (answerIndex) => {
    setQuiz(prev => ({
      ...prev,
      selectedAnswer: answerIndex
    }));
  };

  const submitQuizAnswer = () => {
    if (quiz.selectedAnswer === null) return;
    
    const isCorrect = quiz.selectedAnswer === quiz.questions[quiz.currentQuestion].correct;
    const newScore = isCorrect ? quiz.score + 1 : quiz.score;
    
    if (quiz.currentQuestion < quiz.questions.length - 1) {
      setQuiz(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        score: newScore,
        selectedAnswer: null
      }));
    } else {
      setQuiz(prev => ({
        ...prev,
        score: newScore,
        completed: true,
        showResults: true
      }));
    }
  };

  const resetQuiz = () => {
    setQuiz(prev => ({
      ...prev,
      currentQuestion: 0,
      score: 0,
      selectedAnswer: null,
      completed: false,
      showResults: false
    }));
  };

  const handleSystemClick = (systemName) => {
    if (selectedSystem?.name === systemName) return;

    playSystemClick();

    const system = systems.find(s => s.name === systemName);
    if (system) {
      setSelectedSystem(system);
    }
  };

  const filteredSystems = systems
  .filter(system => 
    system.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    const queryLower = searchQuery.toLowerCase();
    const aLower = a.name.toLowerCase();
    const bLower = b.name.toLowerCase();
    
    const aStartsWith = aLower.startsWith(queryLower);
    const bStartsWith = bLower.startsWith(queryLower);
    
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    
    return a.name.localeCompare(b.name);
  })
  .slice(0, 3);

  const handleSearchSelect = (systemName) => {
    handleSystemClick(systemName);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const toggleMusic = async () => {
    if (audioRef.current) {
      if (!audioStarted) {
        try {
          await audioRef.current.play();
          setAudioStarted(true);
          audioRef.current.volume = 0.15;
          setMusicEnabled(true);
        } catch (error) {
          console.error('Audio play failed:', error);
        }
      } else {
        if (musicEnabled) {
          audioRef.current.volume = 0;
          setMusicEnabled(false);
        } else {
          audioRef.current.volume = 0.2;
          setMusicEnabled(true);
        }
      }
      playButtonClick();
    }
  };

  return (
    <div className="relative min-h-screen text-yellow-400 bg-fixed bg-center bg-cover bg-no-repeat" style={{ backgroundImage: "url('/images/bg_wbw.webp')" }}>
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/ambient_soundtrack.mp3" type="audio/mpeg" />
      </audio>
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      <div className="relative z-10">
        <div className="text-yellow-400">
          {/* Header */}
          <nav className="bg-gradient-to-br from-gray-900 to-black shadow-lg border-b-2 border-yellow-600 fixed top-0 left-0 w-full z-[1000]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1
                  className="cursor-pointer text-3xl p-1 font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center space-x-2"
                  onClick={() => window.location.reload()}
                >
                  <img
                  src="images/holocron.webp" 
                  className="h-9 w-9 object-contain"
                  ></img>
                  <span>Star Wars Galactic Navigation Archive</span>
                </h1>

                <div className="flex items-center space-x-4">
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-gray-900 to-black rounded-lg text-sm border-2 border-yellow-500 text-yellow-400 focus:outline-none focus:border-yellow-500 font-bold transition-all transform hover:scale-105"
                    onClick={toggleMusic}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {musicEnabled ? (
                        <>
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </>
                      ) : (
                        <>
                          <path d="M3 9v6h4l5 5V4L7 9H3z"/>
                          <path d="M15 10l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        </>
                      )}
                    </svg>
                    <span>Music</span>
                  </button>

                  {user ? (
                    <div className="flex items-center space-x-3">
                      <button 
                        className="px-4 py-2 bg-gradient-to-br from-gray-900 to-black rounded-lg transition-all transform hover:scale-105 text-sm border-2 border-yellow-500 text-yellow-400 font-bold"
                        onClick={() => {
                          setUser(null);
                          playButtonClick();
                        }}
                      >
                        Sign out
                      </button>
                      <span className="text-yellow-400 text-lm font-bold">Hey, {user.username}!</span>
                    </div>
                  ) : (
                    <button 
                      className={`px-4 py-2 bg-gradient-to-br from-gray-900 to-black rounded-lg text-sm border-2 border-yellow-500 text-yellow-400 font-bold transition-all transform ${
                        showLogin
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:scale-105'
                      }`}
                      onClick={() => {
                        !showLogin && setShowLogin(true);
                        playButtonClick();
                      }}
                      disabled={showLogin}
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Login */}
          {showLogin && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl shadow-2xl border-2 border-yellow-600 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Sign into your account</h2>
                  <button 
                    className="text-yellow-400 hover:text-yellow-200 text-2xl"
                    onClick={() => {
                      setShowLogin(false);
                      playCloseClick();
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-yellow-400 mb-2">Username</label>
                    <input
                      type="text"
                      className={`w-full p-3 bg-black bg-opacity-50 border-2 rounded-lg text-amber-200 placeholder-yellow-400 ${
                        loginErrors.username ? 'border-red-500' : 'border-yellow-500'
                      } focus:border-yellow-400 focus:outline-none`}
                      value={loginForm.username}
                      onChange={(e) => setLoginForm(prev => ({...prev, username: e.target.value}))}
                      placeholder="Enter username"
                    />
                    {loginErrors.username && (
                      <p className="text-red-400 text-sm mt-1">{loginErrors.username}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-bold text-yellow-400 mb-2">Password</label>
                    <input
                      type="password"
                      className={`w-full p-3 bg-black bg-opacity-50 border-2 rounded-lg text-amber-200 placeholder-yellow-400 ${
                        loginErrors.password ? 'border-red-500' : 'border-yellow-600'
                      } focus:border-yellow-400 focus:outline-none`}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                      placeholder="Enter password"
                    />
                    {loginErrors.password && (
                      <p className="text-red-400 text-sm mt-1">{loginErrors.password}</p>
                    )}
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button 
                      className="flex-1 py-2 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors text-yellow-300 font-bold"
                      onClick={() => {
                        playCloseClick();
                        setShowLogin(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="flex-1 py-2 text-black font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg transition-all transform hover:scale-105"
                      onClick={() => {
                        playButtonClick();
                        handleLogin();
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-20 max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Galaxy Map */}
              <div className="xl:col-span-2">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-2xl border-2 border-yellow-600 overflow-visible">
                  <div className="p-4 border-b-2 border-yellow-600 flex justify-between items-center">
                    <h2 className="text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-bold">Complete Galaxy Map</h2>
                    <div className="flex items-center space-x-3">
                      {/* Search Bar */}
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search systems"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setShowSearchResults(e.target.value.length > 0);
                            }}
                            onFocus={() => {
                              setShowSearchResults(searchQuery.length > 0);
                              setSearchFocused(true);
                            }}
                            onBlur={(e) => {
                              setTimeout(() => setShowSearchResults(false), 200);
                              setSearchFocused(false);
                            }}
                          className="w-48 pl-10 pr-3 py-2 bg-gradient-to-br from-gray-900 to-black bg-opacity-50 border-2 border-yellow-500 rounded-lg text-yellow-300 placeholder-yellow-400 focus:border-yellow-400 focus:outline-none text-sm"
                          />
                          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-yellow-400' : 'text-yellow-500'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        {showSearchResults && searchQuery && filteredSystems.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto">
                            {filteredSystems.map((system) => (
                              <div
                                key={system.name}
                                onClick={() => handleSearchSelect(system.name)}
                                className="px-3 py-1 cursor-pointer text-yellow-400 hover:bg-gray-800 hover:text-yellow-300 transition-colors duration-150"
                              >
                                {system.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button 
                        className="px-3 py-2 bg-gradient-to-br from-gray-900 to-black rounded-lg transition-all transform hover:scale-105 text-sm border-2 border-yellow-500 text-yellow-400 font-bold"
                        onClick={() => {
                          playUpdateClick();
                          fetchSystems();
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="relative bg-gray-950 rounded-lg h-80 sm:h-96 overflow-visible">
                    {/* Region Shapes */}
                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-80">
                        <div className="absolute top-1/2 left-1/2 w-[43rem] h-[24rem] transform -translate-x-1/2 -translate-y-1/2 bg-blue-950/40 border backdrop-blur-md" style={{ borderRadius: '50%' }}></div>
                        <div className="absolute top-[50%] left-[22%] w-[12rem] h-[16rem] transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/100 border border-2 border-black" style={{ borderRadius: '50%' }}></div>
                        <div className="absolute left-1/2 top-1/2 w-28 h-14 transform -translate-x-1/2 -translate-y-1/2 border opacity-40 bg-white/60 backdrop-blur-sm" style={{ borderRadius: '50%' }}></div>
                        <div className="absolute left-[53%] top-1/2 w-56 h-36 transform -translate-x-1/2 -translate-y-1/2 border rounded-full opacity-35 bg-cyan-100/50 backdrop-blur-md" style={{ borderRadius: '50%' }}></div>
                        <div className="absolute left-[56%] top-1/2 w-80 h-56 transform -translate-x-1/2 -translate-y-1/2 border rounded-full opacity-30 bg-cyan-200/40 backdrop-blur-lg" style={{ borderRadius: '50%' }}></div>
                        <div className="absolute left-[59%] top-1/2 w-96 h-72 transform -translate-x-1/2 -translate-y-1/2 border rounded-full opacity-25 bg-cyan-300/30 backdrop-blur-xl" style={{ borderRadius: '50%' }}></div>
                        <div className="absolute left-[62%] top-1/2 w-[28rem] h-80 transform -translate-x-1/2 -translate-y-1/2 border rounded-full opacity-20 bg-cyan-400/20 backdrop-blur-2xl" style={{ borderRadius: '50%' }}></div>
                        <div className="absolute top-1/2 right-[16%] w-20 h-32 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/60 border-2 border-red-800" style={{ borderRadius: '50%' }}></div>
                    </div>

                    {/* Region Names */}
                    <div className="absolute inset-0 text-xs font-semibold pointer-events-none">
                        {/* Wild Space*/}
                        <div className="absolute bottom-[-1%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="bg-black bg-opacity-90 px-2 py-1 rounded text-emerald-400 font-bold">Wild Space</div>
                        </div>

                        {/* Unknown Regions*/}
                        <div className="absolute top-1/2 left-[22%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="bg-black bg-opacity-90 px-2 py-1 rounded text-purple-600 font-bold">Unknown Regions</div>
                        </div>

                        {/* Hutt Space*/}
                        <div className="absolute top-1/2 right-[6.4%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="bg-black bg-opacity-90 px-2 py-1 rounded text-red-600 font-bold">Hutt Space</div>
                        </div>

                        {/* Outer Rim */}
                        <div className="absolute top-[86%] right-[26%] transform translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="bg-black bg-opacity-90 px-2 py-1 rounded text-cyan-400 font-bold">Outer Rim</div>
                        </div>

                        {/* Mid Rim */}
                        <div className="absolute top-[78%] right-[31%] transform translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="bg-black bg-opacity-90 px-2 py-1 rounded text-cyan-400 font-bold">Mid Rim</div>
                        </div>

                        {/* Inner Rim */}
                        <div className="absolute top-[69%] right-[36%] transform translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="bg-black bg-opacity-90 px-2 py-1 rounded text-cyan-400 font-bold">Inner Rim</div>
                        </div>

                        {/* Core Worlds */}
                        <div className="absolute top-[60%] right-[32%] transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="bg-black bg-opacity-90 px-2 py-1 rounded text-cyan-400 font-bold">Core Worlds</div>
                        </div>

                        {/* Deep Core */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="bg-black bg-opacity-90 px-3 py-1 rounded text-cyan-400 font-bold">Deep Core</div>
                        </div>
                    </div>
                    
                    {/* Stars background */}
                    <div className="absolute inset-0 pointer-events-none">
                      {stars.map((star, i) => (
                        <div
                          key={i}
                          className="absolute bg-white rounded-full animate-pulse"
                          style={star}
                        />
                      ))}
                    </div>
                    
                    {/* Systems */}
                    {!loading && systems.map((system) => {
                      const position = systemPositions[system.name];
                      if (!position) return null;

                      const isLowPosition = position.y > 80;
                      const isHovered = hoveredSystem === system.name || selectedSystem?.name === system.name;

                      return (
                        <div
                          key={system.name}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-150 ${
                            hoveredSystem === system.name ? 'z-50' : 
                            selectedSystem?.name === system.name ? 'z-30' : 
                            'z-20'
                          }`}
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`
                          }}
                          onClick={() => handleSystemClick(system.name)}
                          onMouseEnter={() => setHoveredSystem(system.name)}
                          onMouseLeave={() => setHoveredSystem(null)}
                        >
                          <div
                            className="w-2 h-2 rounded-full shadow-lg border border-white hover:border-yellow-300 animate-pulse transition-all duration-300"
                            style={{ backgroundColor: '#E0FFFF',
                              pointerEvents: isHovered ? 'none' : 'auto'
                            }}
                          />

                          <div className={`absolute left-1/2 transform -translate-x-1/2 text-xs text-yellow-400 whitespace-nowrap bg-black bg-opacity-90 px-3 py-2 rounded-lg pointer-events-none border-2 border-yellow-400 transition-all duration-700 ease-out ${
                            isHovered
                              ? `opacity-100 translate-y-0 scale-55 ${hoveredSystem === system.name ? 'z-[100]' : 'z-[60]'}`
                              : 'opacity-0 translate-y-2 scale-45'
                          } ${
                            isLowPosition ? 'bottom-full mb-2' : 'top-full mt-2'
                          }`}>
                            <div className="font-bold">{system.name} System</div>
                            <div className={`${
                              position.region === 'Hutt Space' ? 'text-red-600' :
                              position.region === 'Unknown Regions' ? 'text-purple-600' :
                              position.region === 'Wild Space' ? 'text-emerald-400' :
                              'text-cyan-300'
                            }`}>{position.region}</div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="text-center bg-gray-800 bg-opacity-70 rounded-lg p-6">
                          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto duration-500 mb-4"></div>
                          <p className="text-yellow-400 font-bold">Loading the Galaxy . . .</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected System Details */}
                {selectedSystem && (
                  <div className="mt-6 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl border-2 border-yellow-600">
                    <div className="p-4 border-b-2 border-yellow-600 flex justify-between items-center">
                      <h3 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                        {selectedSystem.name} System
                      </h3>
                      <button 
                        className="text-yellow-400 hover:text-yellow-200 text-2xl"
                        onClick={() => {
                          playCloseClick();
                          setSelectedSystem(null);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-center mb-2 sm:mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <figure className="flex flex-col items-center">
                            <div className="inline-block border-2 border-yellow-500 rounded-lg shadow-lg mb-1">
                              <img
                              className="max-h-60 object-contain rounded-lg"
                              src={selectedSystem.img1}
                              alt="Image couldn't load"
                              />
                            </div>
                            <figcaption className="text-sm text-amber-400 text-center mb-1">
                              {selectedSystem.caption1}
                            </figcaption>
                          </figure>
                          <figure className="flex flex-col items-center">
                            <div className="inline-block border-2 border-yellow-500 rounded-lg shadow-lg mb-1">
                              <img
                              className="max-h-60 object-contain rounded-lg"
                              src={selectedSystem.img2}
                              alt="Image couldn't load"
                              />
                            </div>
                            <figcaption className="text-sm text-amber-400 text-center mb-1">
                              {selectedSystem.caption2}
                            </figcaption>
                          </figure>
                        </div>
                      </div>
                      <p className="text-amber-200 mb-4 leading-relaxed">{selectedSystem.description}</p>
                      <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg shadow-lg border-2 border-yellow-500 mb-3">
                        <div className="border-b border-yellow-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 pb-1 text-left p-3">
                            <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Main information:</h4>
                            <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Living conditions:</h4>
                          </div>
                        </div>
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-3">
                            <div>
                              <div className="space-y-2 text-sm text-left">
                                <p className="mb-0 leading-relaxed text-amber-200">
                                  <span className="inline-block align-baseline">
                                    <span className="text-yellow-400 font-bold">Featured in:</span> {selectedSystem.featured}
                                  </span>
                                </p>
                                <p className="mb-0 leading-relaxed text-amber-200"><span className="text-yellow-400 font-bold">Diameter:</span> {selectedSystem.diameter} km</p>
                                <p className="mb-0 leading-relaxed text-amber-200"><span className="text-yellow-400 font-bold">Orbital period:</span> {selectedSystem.orbital_period} days</p>
                                <p className="mb-0 leading-relaxed text-amber-200"><span className="text-yellow-400 font-bold">Rotation period:</span> {selectedSystem.rotation_period} hours</p>
                                <p className="mb-0 leading-relaxed text-amber-200"><span className="text-yellow-400 font-bold">Population:</span> {selectedSystem.population}</p>
                              </div>
                            </div>
                            <div>
                              <div className="space-y-2 text-sm text-left">
                                <p className="mb-0 leading-relaxed text-amber-200">
                                  <span className="inline-block align-baseline">
                                  <span className="text-yellow-400 font-bold">Terrain:</span> {selectedSystem.terrain}
                                  </span>
                                </p>
                                <p className="mb-0 leading-relaxed text-amber-200"><span className="text-yellow-400 font-bold">Climate:</span> {selectedSystem.climate}</p>
                                <p className="mb-0 leading-relaxed text-amber-200"><span className="text-yellow-400 font-bold">Atmosphere:</span> {selectedSystem.atmosphere}</p>
                                <p className="mb-0 leading-relaxed text-amber-200"><span className="text-yellow-400 font-bold">Surface water:</span> {selectedSystem.surface_water}%</p>
                                <p className="mb-0 leading-relaxed text-amber-200"><span className="text-yellow-400 font-bold">Gravity:</span> {selectedSystem.gravity}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">

                {/* Quiz Section */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl border-2 border-yellow-600">
                  <div className="p-4 border-b-2 border-yellow-600">
                    <h3 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Systems Quiz</h3>
                  </div>
                  <div className="p-6">
                    {!quiz.completed ? (
                      <>
                        <div className="flex space-x-2 mb-4">
                          <span className="px-3 py-1 text-sm bg-gradient-to-br from-gray-900 to-black rounded-lg border-2 border-yellow-500 text-yellow-400 font-bold">
                            Question {quiz.currentQuestion + 1} of {quiz.questions.length}
                          </span>
                          <span className="px-3 py-1 text-sm bg-gradient-to-br from-gray-900 to-black rounded-lg border-2 border-emerald-500 text-emerald-400 font-bold">
                            Score: {quiz.score}
                          </span>
                        </div>
                        <h5 className="p-1 py-3 bg-gradient-to-br from-gray-900 to-black rounded-lg border-2 border-yellow-500 text-yellow-400 font-bold mb-4">
                          {quiz.questions[quiz.currentQuestion].question}
                        </h5>
                        <div className="space-y-2 mb-4">
                          {quiz.questions[quiz.currentQuestion].options.map((option, index) => (
                            <label key={index} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-800 transition-colors">
                              <input
                                type="radio"
                                name="quizAnswer"
                                checked={quiz.selectedAnswer === index}
                                onChange={() => handleQuizAnswer(index)}
                                className="appearance-none w-3.5 h-3 rounded-full border-2 border-yellow-500 checked:bg-yellow-500 checked:border-yellow-500 focus:outline-none transition-colors duration-200"
                              />
                              <span className="text-yellow-400">{option}</span>
                            </label>
                          ))}
                        </div>
                        <button 
                          className="w-full py-2 text-black font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          onClick={() => {
                            playButtonClick();
                            submitQuizAnswer();
                          }}
                          disabled={quiz.selectedAnswer === null}
                        >
                          {quiz.currentQuestion < quiz.questions.length - 1 ? 'Next' : 'Finish'}
                        </button>
                      </>
                    ) : (
                      <div className="text-center">
                        <h4 className="text-xl text-yellow-400 mb-2">Quiz over!</h4>
                        <p className="text-lg text-amber-200 mb-4">
                          Your result: {quiz.score} of {quiz.questions.length}
                          <br/>
                          ({Math.round((quiz.score / quiz.questions.length) * 100)}%)
                        </p>
                        <button 
                          className="px-6 py-2 text-black font-bold bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg transition-all transform hover:scale-105"
                          onClick={() => {
                            playButtonClick();
                            resetQuiz();
                          }}
                        >
                          Try again
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Survey Section */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl border-2 border-yellow-600">
                  <div className="p-4 border-b-2 border-yellow-600">
                    <h3 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Galactic Survey</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-amber-200 mb-2">Your faction:</label>
                        <CustomSelect 
                          options={factions}
                          placeholder="Choose a faction"
                          onSelect={setSelectedSurveyFaction}
                          isOpen={openDropdown === "Choose a faction"}
                          onOpen={setOpenDropdown}
                        />                 
                    </div>

                    <div>
                      <label className="block mb-2 text-amber-200 mb-2">Your system:</label>
                        <CustomSelect
                          options={systemPositions}
                          placeholder="Choose a system"
                          onSelect={setSelectedSurveySystem}
                          isOpen={openDropdown === "Choose a system"}
                          onOpen={setOpenDropdown}
                        />
                    </div>

                    {selectedSurveyFaction && (
                      <div className="mt-4">
                        <label className="block text-amber-200 mb-2">Your rank:</label>
                        <div className="space-y-2">
                          {(factionRanks[selectedSurveyFaction] || []).map((rank) => (
                            <label key={rank} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="factionRank"
                                checked={selectedSurveyRank === rank}
                                onChange={() => setSelectedSurveyRank(rank)}
                                className="appearance-none w-3.5 h-3 rounded-full border-2 border-yellow-500 checked:bg-yellow-500 checked:border-yellow-500 focus:outline-none transition-colors duration-200"
                              />
                              <span className="text-yellow-400">{rank}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedSurveyFaction || selectedSurveySystem || selectedSurveyRank) && (
                      <div className="bg-gradient-to-br from-gray-900 to-black bg-opacity-70 border-2 border-yellow-500 rounded-lg p-4">
                        <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-3">Your answers:</h4>
                        <div className="text-sm space-y-1">
                          {selectedSurveyFaction && 
                            <p className="mb-0 leading-relaxed text-amber-200">
                              <span className="inline-block align-baseline">
                                <span className="text-yellow-400 font-bold">Faction:</span> {selectedSurveyFaction}
                              </span>
                            </p>
                          }
                          {selectedSurveySystem && 
                            <p className="mb-0 leading-relaxed text-amber-200">
                              <span className="inline-block align-baseline">
                                <span className="text-yellow-400 font-bold">System:</span> {selectedSurveySystem}
                              </span>
                            </p>
                          }
                          {selectedSurveyRank && 
                            <p className="mb-0 leading-relaxed text-amber-200">
                              <span className="inline-block align-baseline">
                                <span className="text-yellow-400 font-bold">Rank:</span> {selectedSurveyRank}
                              </span>
                            </p>
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="relative bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm py-4 mt-8 mb-0 border-t-2 border-yellow-600">
            <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
              <img src="/images/sw_logo.png" className="h-12 object-contain" />
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">May the Force be with you!</p>
              <p className="text-yellow-400 text-sm font-semibold">Data is automatically updated every 30 seconds</p>
            </div>
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <img img src="/images/lucasfilm_logo.png" className="h-24 object-contain" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default StarWarsGalaxyMap;