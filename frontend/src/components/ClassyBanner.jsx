import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const classyImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVw22Oogk1qjUhg_7ha-hYkuzB8b6BLDJk3A&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtINO3J3NxEd6oh2wbZd53P1o2O3OrT0VAGg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBOopMOv8tIB17_6MmBezle7XfUyzWFjGnDw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4RyvSmMv4Zmxi8p76phq4yLzSbMVEEHBGqQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2WrH8nGF1DyiE0FNqxbMGF0xkbjxBVVuFRg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwwJJCmEX9oL3sfnzZACNJ7FY6XmX_euT1Gw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZE8Vbf9VUbHeZgfk7o-FHFlo4s8k7aCqhqg&s"
];

const ClassyBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % classyImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + classyImages.length) % classyImages.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % classyImages.length);
    };

    return (
        <section className="py-16 bg-[#fdfbf7]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4 tracking-wide">Timeless Elegance</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mb-4" style={{ backgroundColor: '#D4AF37' }}></div>
                    <p className="text-gray-600 italic font-serif text-lg">Discover our exclusive classic collection</p>
                </div>

                <div className="relative w-full max-w-7xl mx-auto group">
                    <div className="overflow-hidden rounded-xl shadow-2xl border-4 border-double border-[#D4AF37]">
                        <div
                            className="flex transition-transform duration-1000 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {classyImages.map((src, index) => (
                                <div key={index} className="min-w-full relative h-[400px] md:h-[600px] overflow-hidden flex items-center justify-center bg-gray-100">
                                    {/* Blurred Background */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-60"
                                        style={{ backgroundImage: `url(${src})` }}
                                    ></div>

                                    {/* Main Image */}
                                    <img
                                        src={src}
                                        alt={`Classy Banner ${index + 1}`}
                                        className="relative z-10 h-full w-auto max-w-full object-contain shadow-2xl rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#D4AF37] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                    >
                        <FaChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#D4AF37] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                    >
                        <FaChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {classyImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-[#D4AF37] w-8' : 'bg-white/60 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClassyBanner;
