import React, { useState, useEffect, useRef } from 'react';
import './index.css';

export default function DunderMifflinSlider() {
  const [current, setCurrent] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);

  const sections = [
    {
      id: 'products',
      title: 'Products Catalog',
      desc: 'Explore our premium paper and office supplies',
      bg: '/images/products-bg.jpg',
      thumb: '/images/products-thumb.jpg',
      details: {
        intro: 'Discover our comprehensive range of paper products and office supplies.',
        categories: [
          {
            name: 'Paper Types',
            items: ['Coated (Glossy)', 'Uncoated (Matte)', 'Textured']
          },
          {
            name: 'Quality/Weight',
            items: ['Copy Paper (80-100 GSM)', 'Premium (120-160 GSM)', 'Card Stock (300-350 GSM)']
          },
          {
            name: 'Sizes',
            items: ['A4', 'A3', 'Letter', 'Legal']
          },
          {
            name: 'Colors',
            items: ['White', 'Pastel Colors', 'Neon']
          },
          {
            name: 'Eco-Friendly',
            items: ['Recycled Paper', 'FSC-Certified']
          }
        ],
        additional: 'We also offer envelopes, notebooks, filing folders, printer ribbons, and other stationery essentials.'
      }
    },
    {
      id: 'employees',
      title: 'Meet Our Team',
      desc: 'The faces behind Scranton\'s finest',
      bg: '/images/employees-bg.jpg',
      thumb: '/images/employees-thumb.jpg',
      details: {
        intro: 'Get to know the dedicated professionals at Dunder Mifflin Scranton.',
        departments: [
          {
            name: 'Branch Management',
            staff: ['Dwight Schrute - Regional Manager', 'Jim Halpert - Assistant Regional Manager']
          },
          {
            name: 'Sales Team',
            staff: ['Phyllis Vance - Director of Sales', 'Danny Cordray - Sales Rep', 'Clark Green - Sales Rep']
          },
          {
            name: 'Accounting',
            staff: ['Oscar Martinez - Chief Accountant', 'Angela Martin - Senior Accountant', 'Kevin Malone - Accountant']
          },
          {
            name: 'Human Resources & Reception',
            staff: ['Toby Flenderson - HR Representative', 'Erin Hannon - Receptionist']
          },
          {
            name: 'Warehouse',
            staff: ['Val Johnson - Warehouse Foreman', 'Darryl Philbin - Warehouse Manager', 'Nate Nickerson - Warehouse Worker']
          }
        ]
      }
    },
    {
      id: 'warehouse',
      title: 'Warehouse & Facility',
      desc: 'Our distribution center at Scranton Business Park',
      bg: '/images/warehouse-bg.jpg',
      thumb: '/images/warehouse-thumb.jpg',
      details: {
        intro: 'Our warehouse and shipping center operates from the Scranton Business Park location.',
        address: '1725 Slough Avenue, Scranton Business Park',
        highlights: [
          '7-year lease with Beekman Properties',
          'Fast fulfillment and organized distribution',
          'State-of-the-art loading dock facilities',
          'Efficient inventory management systems'
        ],
        description: 'We pride ourselves on maintaining a well-organized distribution center that ensures your orders are processed quickly and accurately.'
      }
    },
    {
      id: 'branches',
      title: 'Branches & Company',
      desc: 'Dunder Mifflin locations across the Northeast',
      bg: '/images/branches-bg.jpg',
      thumb: '/images/branches-thumb.jpg',
      details: {
        intro: 'While the Scranton branch is our focus, Dunder Mifflin serves the entire Northeast region.',
        headquarters: 'New York City',
        scranton: 'The Scranton branch is the flagship location, known for exceptional customer service and consistent performance.',
        otherBranches: [
          'Utica Branch',
          'Buffalo Branch',
          'Rochester Branch',
          'Binghamton Branch',
          'Albany Branch'
        ],
        note: 'The Scranton branch has consistently been one of our top-performing locations.'
      }
    }
  ];

  const isMobile = () => window.matchMedia("(max-width:767px)").matches;

  const center = (i) => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!track || !wrap) return;

    const cardElements = track.children;
    if (!cardElements[i]) return;

    const card = cardElements[i];
    const axis = isMobile() ? "top" : "left";
    const size = isMobile() ? "clientHeight" : "clientWidth";
    const start = isMobile() ? card.offsetTop : card.offsetLeft;
    
    wrap.scrollTo({
      [axis]: start - (wrap[size] / 2 - card[size] / 2),
      behavior: "smooth"
    });
  };

  const activate = (i, scroll = false) => {
    if (i === current) return;
    setCurrent(i);
    if (scroll) {
      setTimeout(() => center(i), 50);
    }
  };

  const go = (step) => {
    const newIndex = Math.min(Math.max(current + step, 0), sections.length - 1);
    activate(newIndex, true);
  };

  const handleDetails = (section, e) => {
    e.stopPropagation();
    setSelectedCard(section);
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedCard(null);
  };

  useEffect(() => {
    center(current);
  }, [current]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showDetails) return;
      if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
    };

    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, showDetails]);

  useEffect(() => {
    const handleResize = () => center(current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [current]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let sx = 0, sy = 0;

    const handleTouchStart = (e) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60) {
        go((isMobile() ? dy : dx) > 0 ? -1 : 1);
      }
    };

    track.addEventListener("touchstart", handleTouchStart, { passive: true });
    track.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      track.removeEventListener("touchstart", handleTouchStart);
      track.removeEventListener("touchend", handleTouchEnd);
    };
  }, [current]);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderDetailsContent = () => {
    if (!selectedCard) return null;

    const { id, title, details } = selectedCard;

    switch(id) {
      case 'products':
        return (
          <div className="details-section">
            <p className="details-intro">{details.intro}</p>
            <div className="categories-grid">
              {details.categories.map((cat, i) => (
                <div key={i} className="category-card">
                  <h3>{cat.name}</h3>
                  <ul>
                    {cat.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="additional-info">{details.additional}</p>
          </div>
        );

      case 'employees':
        return (
          <div className="details-section">
            <p className="details-intro">{details.intro}</p>
            {details.departments.map((dept, i) => (
              <div key={i} className="department-section">
                <h3>{dept.name}</h3>
                <ul className="staff-list">
                  {dept.staff.map((person, j) => (
                    <li key={j}>{person}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'warehouse':
        return (
          <div className="details-section">
            <p className="details-intro">{details.intro}</p>
            <div className="address-box">
              <strong>Location:</strong> {details.address}
            </div>
            <h3>Highlights</h3>
            <ul className="highlights-list">
              {details.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
            <p className="warehouse-desc">{details.description}</p>
          </div>
        );

      case 'branches':
        return (
          <div className="details-section">
            <p className="details-intro">{details.intro}</p>
            <div className="hq-box">
              <strong>Headquarters:</strong> {details.headquarters}
            </div>
            <div className="scranton-highlight">
              <h3>Scranton Branch</h3>
              <p>{details.scranton}</p>
            </div>
            <h3>Other Branches</h3>
            <ul className="branches-list">
              {details.otherBranches.map((branch, i) => (
                <li key={i}>{branch}</li>
              ))}
            </ul>
            <p className="branch-note">{details.note}</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (showDetails && selectedCard) {
    // Inject the background image dynamically
    const styleElement = document.getElementById('dynamic-bg-style');
    if (styleElement) {
      styleElement.textContent = `.details-page.active::before { background-image: url('${selectedCard.bg}') !important; }`;
    } else {
      const style = document.createElement('style');
      style.id = 'dynamic-bg-style';
      style.textContent = `.details-page.active::before { background-image: url('${selectedCard.bg}') !important; }`;
      document.head.appendChild(style);
    }

    return (
      <section className="details-page active">
        <div className="details-overlay"></div>
        <div className="details-container">
          <div className="details-header">
            <img src="/images/logo.png" alt="Dunder Mifflin Logo" className="company-logo-small" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <button className="back-btn" onClick={handleBack}>← Back</button>
              <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          <div className="details-content">
            <h1>{selectedCard.title}</h1>
            {renderDetailsContent()}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="mainSection" className="main-section">
      <div className="logo-header">
        <img src="/images/logo.png" alt="Dunder Mifflin Logo" className="company-logo" />
      </div>

      <div className="head">
        <div className="company-name">
          <h2>DUNDER MIFFLIN PAPER COMPANY</h2>
          <p className="branch-name">Scranton Branch</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className="controls">
            <button 
              id="prev" 
              className="nav-btn" 
              aria-label="Prev"
              disabled={current === 0}
              onClick={() => go(-1)}
            >
              ‹
            </button>
            <button 
              id="next" 
              className="nav-btn" 
              aria-label="Next"
              disabled={current === sections.length - 1}
              onClick={() => go(1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="slider">
        <div className="track" id="track" ref={trackRef}>
          {sections.map((section, i) => (
            <article 
              key={section.id}
              className="project-card"
              active={i === current ? '' : undefined}
              data-category={section.id}
              onClick={() => activate(i, true)}
              onMouseEnter={() => {
                if (window.matchMedia("(hover:hover)").matches) {
                  activate(i, true);
                }
              }}
            >
              <div className="project-card__bg-wrapper">
                <img className="project-card__bg" src={section.bg} alt="" />
              </div>
              <div className="project-card__content">
                <img className="project-card__thumb" src={section.thumb} alt="" />
                <div>
                  <h3 className="project-card__title">{section.title}</h3>
                  <p className="project-card__desc">{section.desc}</p>
                  <button 
                    className="project-card__btn"
                    onClick={(e) => handleDetails(section, e)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="dots" id="dots" hidden={isMobile()}>
        {sections.map((_, i) => (
          <span 
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => activate(i, true)}
          />
        ))}
      </div>
    </section>
  );
}
