import { useState } from "react";
import "../styles/halorai.css";

const categories = ["Fellowship", "Love", "Prayer Retreat", "Conference", "Birthday"];

const communityDesigns = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=560&fit=crop",
    alt: "Choir Retreat Design",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=560&fit=crop",
    alt: "Element in Spirit Design",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=560&fit=crop",
    alt: "Holy Spirit Design",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&h=560&fit=crop",
    alt: "Pneuma Tikos Design",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1492176273113-2d51f47b23b0?w=400&h=560&fit=crop",
    alt: "Holy Spirit Part 1 Design",
  },
];

const HaloRAI = () => {
  const [activeCategory, setActiveCategory] = useState("Prayer Retreat");

  return (
    <div className="halorai-page">
      {/* Top Navbar */}
      <nav className="halorai-navbar">
        <div className="halorai-logo">
          <span className="logo-text">Halorai</span>
          <span className="logo-star">✦</span>
        </div>
        <div className="navbar-right">
          <span className="nav-link-pricing">Pricing</span>
          <div className="user-info">
            <div className="user-avatar">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                alt="User avatar"
              />
            </div>
            <span className="user-name">Johnny Adams</span>
          </div>
          <button className="dark-mode-toggle">
            <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
              <path d="M10.5 18.375C8.3125 18.375 6.45312 17.6094 4.92188 16.0781C3.39062 14.5469 2.625 12.6875 2.625 10.5C2.625 8.3125 3.39062 6.45312 4.92188 4.92188C6.45312 3.39062 8.3125 2.625 10.5 2.625C10.7042 2.625 10.9048 2.63229 11.102 2.64688C11.2992 2.66146 11.4923 2.68333 11.6813 2.7125C11.0833 3.13542 10.6056 3.68608 10.248 4.3645C9.89042 5.04292 9.71192 5.77558 9.7125 6.5625C9.7125 7.875 10.1719 8.99062 11.0906 9.90937C12.0094 10.8281 13.125 11.2875 14.4375 11.2875C15.2396 11.2875 15.976 11.1087 16.6469 10.7511C17.3177 10.3935 17.8646 9.91608 18.2875 9.31875C18.3167 9.50833 18.3385 9.70142 18.3531 9.898C18.3677 10.0946 18.375 10.2953 18.375 10.5C18.375 12.6875 17.6094 14.5469 16.0781 16.0781C14.5469 17.6094 12.6875 18.375 10.5 18.375Z" fill="#B4B4B4"/>
            </svg>
          </button>
          <button className="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <div className="halorai-body">
        {/* Left Sidebar */}
        <aside className="halorai-sidebar">
          <div className="sidebar-top">
            <h2 className="welcome-text">Welcome back,<br />Johnny</h2>
            <nav className="sidebar-nav">
              <a href="#" className="sidebar-link active">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M1.83334 11.187C1.83334 9.08873 1.83334 8.04006 2.31001 7.17106C2.78484 6.30115 3.65476 5.76215 5.39368 4.68231L7.22701 3.54473C9.06493 2.40348 9.98434 1.83331 11 1.83331C12.0157 1.83331 12.9342 2.40348 14.773 3.54473L16.6063 4.68231C18.3453 5.76215 19.2152 6.30115 19.6909 7.17106C20.1667 8.04098 20.1667 9.08873 20.1667 11.1861V12.5812C20.1667 16.1562 20.1667 17.9446 19.0923 19.0556C18.018 20.1666 16.2901 20.1666 12.8333 20.1666H9.16668C5.70993 20.1666 3.98109 20.1666 2.90768 19.0556C1.83426 17.9446 1.83334 16.1571 1.83334 12.5812V11.187Z" stroke="#343434" strokeWidth="1.375"/>
                  <path d="M11 13.75V16.5" stroke="#343434" strokeWidth="1.375" strokeLinecap="round"/>
                </svg>
                Home
              </a>
              <a href="#" className="sidebar-link">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.125 3.4375C4.125 3.25516 4.19743 3.0803 4.32636 2.95136C4.4553 2.82243 4.63016 2.75 4.8125 2.75H17.1875C17.3698 2.75 17.5447 2.82243 17.6736 2.95136C17.8026 3.0803 17.875 3.25516 17.875 3.4375V7.5625H18.5625C18.7448 7.5625 18.9197 7.63493 19.0486 7.76386C19.1776 7.8928 19.25 8.06766 19.25 8.25V17.1875C19.25 17.3698 19.1776 17.5447 19.0486 17.6736C18.9197 17.8026 18.7448 17.875 18.5625 17.875H3.4375C3.25516 17.875 3.0803 17.8026 2.95136 17.6736C2.82243 17.5447 2.75 17.3698 2.75 17.1875V6.1875C2.75 6.00516 2.82243 5.8303 2.95136 5.70136C3.0803 5.57243 3.25516 5.5 3.4375 5.5H4.125V3.4375ZM4.125 6.875V10.3125H17.875V8.9375H10.3125C10.2222 8.93766 10.1327 8.92001 10.0491 8.88557C9.96563 8.85112 9.88971 8.80055 9.82575 8.73675L7.96538 6.875H4.125ZM16.5 7.5625V4.125H5.5V5.5H8.25C8.34034 5.49984 8.42983 5.51749 8.51335 5.55193C8.59687 5.58638 8.67279 5.63695 8.73675 5.70075L10.5971 7.5625H16.5Z" fill="#949494"/>
                </svg>
                Your Projects
              </a>
              <a href="#" className="sidebar-link">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M11.0046 9.625H11.0119M14.6667 9.625H14.6749M7.34158 9.625H7.34983" stroke="#949494" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.1667 9.62497C20.1667 8.91914 20.1538 8.22889 20.13 7.56247C20.0539 5.38722 20.0154 4.29914 19.1308 3.40722C18.2463 2.51622 17.127 2.46855 14.8903 2.3723C13.5943 2.31789 12.2972 2.291 11 2.29164C9.64334 2.29164 8.33709 2.31914 7.10967 2.3723C4.87301 2.46855 3.75467 2.51622 2.86917 3.40814C1.98459 4.29914 1.94609 5.38722 1.87001 7.56247C1.82165 8.93705 1.82165 10.3129 1.87001 11.6875C1.94609 13.8627 1.98459 14.9508 2.86917 15.8427C3.75376 16.7337 4.87301 16.7814 7.10967 16.8776C7.78312 16.9064 8.47826 16.9277 9.19509 16.9418C9.87342 16.9546 10.2135 16.9601 10.5123 17.0747C10.8112 17.1893 11.0623 17.4029 11.5647 17.8337L13.5621 19.5479C13.6593 19.6312 13.7784 19.6849 13.9052 19.7025C14.032 19.7202 14.1612 19.7011 14.2774 19.6476C14.3937 19.594 14.4922 19.5082 14.5612 19.4004C14.6302 19.2925 14.6668 19.1672 14.6667 19.0391V16.8868L14.8903 16.8776C17.127 16.7814 18.2453 16.7337 19.1308 15.8418C20.0154 14.9508 20.0539 13.8627 20.13 11.6875C20.1538 11.0211 20.1667 10.3308 20.1667 9.62497Z" stroke="#949494" strokeWidth="1.375" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Give Feedback
              </a>
            </nav>
          </div>

          {/* Upgrade to Pro Card */}
          <div className="upgrade-card">
            <div className="crown-icon">
              <svg width="32" height="32" viewBox="0 0 37 37" fill="none">
                <path d="M9.14201 30.4734C8.7103 30.4734 8.34868 30.3271 8.05716 30.0346C7.76563 29.742 7.61935 29.3804 7.61834 28.9497C7.61732 28.519 7.7636 28.1574 8.05716 27.8649C8.35072 27.5723 8.71233 27.426 9.14201 27.426H27.426C27.8577 27.426 28.2198 27.5723 28.5124 27.8649C28.8049 28.1574 28.9507 28.519 28.9497 28.9497C28.9487 29.3804 28.8024 29.7425 28.5109 30.0361C28.2193 30.3296 27.8577 30.4754 27.426 30.4734H9.14201ZM10.2086 25.1405C9.47213 25.1405 8.81848 24.8993 8.24761 24.4168C7.67675 23.9343 7.32732 23.3248 7.19933 22.5884L5.67566 12.9131C5.62487 12.9131 5.56799 12.9197 5.50501 12.9329C5.44203 12.9461 5.38464 12.9522 5.33284 12.9512C4.69798 12.9512 4.1586 12.7293 3.7147 12.2854C3.27081 11.8415 3.04835 11.3016 3.04734 10.6657C3.04632 10.0298 3.26878 9.49045 3.7147 9.04757C4.16063 8.60469 4.70001 8.38223 5.33284 8.3802C5.96567 8.37817 6.50555 8.60063 6.9525 9.04757C7.39944 9.49451 7.62139 10.0339 7.61834 10.6657C7.61834 10.8435 7.59904 11.0085 7.56044 11.1609C7.52184 11.3133 7.47765 11.4529 7.42788 11.5799L12.1893 13.713L16.9508 7.19936C16.6715 6.99621 16.4429 6.72956 16.2652 6.39944C16.0874 6.06931 15.9985 5.71378 15.9985 5.33287C15.9985 4.69801 16.221 4.15812 16.6659 3.71321C17.1108 3.2683 17.6502 3.04635 18.284 3.04737C18.9179 3.04838 19.4577 3.27084 19.9037 3.71473C20.3496 4.15863 20.5715 4.69801 20.5695 5.33287C20.5695 5.71378 20.4806 6.06931 20.3029 6.39944C20.1251 6.72956 19.8966 6.99621 19.6172 7.19936L24.3787 13.713L29.1401 11.5799C29.0894 11.4529 29.0447 11.3133 29.0061 11.1609C28.9675 11.0085 28.9487 10.8435 28.9497 10.6657C28.9497 10.0308 29.1721 9.49096 29.617 9.04605C30.062 8.60113 30.6013 8.37919 31.2352 8.3802C31.869 8.38122 32.4089 8.60367 32.8548 9.04757C33.3008 9.49147 33.5227 10.0308 33.5207 10.6657C33.5187 11.3006 33.2967 11.8405 32.8548 12.2854C32.413 12.7303 31.8731 12.9522 31.2352 12.9512C31.1844 12.9512 31.1275 12.9451 31.0645 12.9329C31.0016 12.9207 30.9442 12.9141 30.8924 12.9131L29.3687 22.5884C29.2417 23.3248 28.8928 23.9343 28.3219 24.4168C27.7511 24.8993 27.0969 25.1405 26.3594 25.1405H10.2086Z" fill="#FD4300"/>
              </svg>
            </div>
            <h3 className="upgrade-title">Upgrade to Pro</h3>
            <ul className="upgrade-features">
              <li>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="#FD4300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Premium Design
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="#FD4300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                High Export for Print
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="#FD4300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Advance Editing
              </li>
            </ul>
            <button className="coming-soon-btn">Coming soon</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="halorai-main">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Design Your Next Event Today</h1>
              <button className="create-design-btn">
                <span>Create Design</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
            </div>
            <div className="hero-images">
              <div className="hero-card hero-card-1">
                <img src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=280&h=400&fit=crop" alt="Event flyer 1" />
              </div>
              <div className="hero-card hero-card-2">
                <img src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=280&h=400&fit=crop" alt="Event flyer 2" />
              </div>
              <div className="hero-card hero-card-3">
                <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=280&h=400&fit=crop" alt="Event flyer 3" />
              </div>
            </div>
          </section>

          {/* Community Section */}
          <section className="community-section">
            <div className="community-header">
              <h2 className="community-title">Results from our Community</h2>
              <div className="category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-pill ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="community-grid">
              {communityDesigns.map((design) => (
                <div key={design.id} className="community-card">
                  <img src={design.image} alt={design.alt} />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HaloRAI;
