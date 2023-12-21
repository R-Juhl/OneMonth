// Welcome.js
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import './Welcome.css';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../languages/en.json';
import dk from '../languages/dk.json';

import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";

import p1 from '../images/parallax/p1.png';
import p2 from '../images/parallax/p2.png';
import p3 from '../images/parallax/p3.png';
import p4 from '../images/parallax/p4.png';
import p5 from '../images/parallax/p5.png';
import p6 from '../images/parallax/p6.png';
import p7 from '../images/parallax/p7.png';

function Welcome() {
  const { language } = useLanguage();
  const text = language === 'en' ? en : dk;
  const [showScrollDown, setShowScrollDown] = useState(true);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [scrollInProgress, setScrollInProgress] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0); // Scroll to top on component mount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const updateParallaxPosition = (scrollY) => {
    const layers = document.getElementsByClassName('parallax-layer');
    const sections = document.querySelectorAll('.welcome-section');
    Array.from(layers).forEach((layer, index) => {
      // Adjust speed for each layer. p1 moves the most, p9 the least.
      const speed = (9 - index) * 0.1; 
      layer.style.backgroundPosition = `center ${-scrollY * speed}px`;
    });
    Array.from(sections).forEach(section => {
      // Adjust the multiplier for less movement
      section.style.transform = `translateY(${scrollY * 0.55}px) scale(1)`; // Adjust 0.05 as needed
  });
  };

  const smoothScroll = (targetY, duration) => {
    setScrollInProgress(true); // Disable buttons while scrolling
    const startY = window.scrollY;
    const change = targetY - startY;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = () => {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, startY, change, duration);
      window.scrollTo(0, val);
      updateParallaxPosition(val);

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      } else {
        setScrollInProgress(false); // Re-enable buttons after scrolling
      }
    };

    animateScroll();
  };

  Math.easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  const triggerSectionAnimations = () => {
    const sections = document.querySelectorAll('.welcome-section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('visible');
      }, 2000 + (index * 800));
    });
  };

  const scrollToBottom = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    smoothScroll(scrollHeight, 6000);
    triggerSectionAnimations();
    setTimeout(() => {
      setShowScrollDown(false);
      setShowScrollUp(true);
    }, 6000);
  };
  
  const scrollToTop = () => {
    smoothScroll(0, 1000);
    setTimeout(() => {
      fadeOutSections();
      setShowScrollDown(true);
      setShowScrollUp(false);
    }, 1000);
  };

  const fadeOutSections = () => {
    const sections = document.querySelectorAll('.welcome-section');
    sections.forEach(section => {
      section.classList.remove('visible');
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.documentElement.style.setProperty('--scroll-position', scrollPosition);
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="welcome-container">
      <div className="parallax-layer" style={{ backgroundImage: `url(${p1})` }}></div>
      <div className="parallax-layer" style={{ backgroundImage: `url(${p2})` }}></div>
      <div className="parallax-layer" style={{ backgroundImage: `url(${p3})` }}></div>
      <div className="parallax-layer" style={{ backgroundImage: `url(${p4})` }}></div>
      <div className="parallax-layer" style={{ backgroundImage: `url(${p5})` }}></div>
      <div className="parallax-layer" style={{ backgroundImage: `url(${p6})` }}></div>
      <div className="parallax-layer" style={{ backgroundImage: `url(${p7})` }}></div>
      <h1 className="welcome-title">{text.welcomeTitle}</h1>
      {showScrollDown && !scrollInProgress && (
        <button className="scrolldown-button" onClick={scrollToBottom}>
          <HiArrowCircleDown />
        </button>
      )}
      {showScrollUp && !scrollInProgress && (
        <button className="scrollup-button" onClick={scrollToTop}>
          <HiArrowCircleUp />
        </button>
      )}
        <div className="sections-container">
          <div className="welcome-section">
            <p>{parse(text.welcomeDescription1)}</p>
          </div>
          <div className="welcome-section">
            <p>{parse(text.welcomeDescription2)}</p>
          </div>
          <div className="welcome-section">
            <p>{parse(text.welcomeDescription3)}</p>
          </div>
          <div className="welcome-section">
            <p>{parse(text.welcomeDescription4)}</p>
          </div>
          <div className="welcome-section">
            <p>{parse(text.welcomeDescription5)}</p>
          </div>
          <div className="welcome-section final-section">
            <p>{parse(text.welcomeDescription6)}</p>
          </div>
      </div>
    </div>
  );
}

export default Welcome;