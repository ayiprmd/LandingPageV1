import { motion } from 'framer-motion';
import { RandomLetterSwap } from '@/components/ui/random-letter-swap';
import { useState, useRef, useCallback } from 'react';
import { ArrowDown, ArrowUpRight, Check, Menu, MoveRight, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};


const certificates = [
  {
    id: 1,
    number: '01',
    title: 'Education Games',
    issuer: 'Gramedia / Internal Course',
    image: '/Project/Sertifikat 1.jpeg',
  },
  {
    id: 2,
    number: '02',
    title: 'Internship Program',
    issuer: 'Diginusa',
    image: '/Project/Sertifikat 2.jpeg',
  },
  {
    id: 3,
    number: '03',
    title: 'UI/UX Design Essentials',
    issuer: 'Certification Authority',
    image: '/Project/ComingSoon.jpg',
  },
];

const queryClient = new QueryClient();

const navItems = [
  { label: 'Vision', href: '#vision' },
  { label: 'About Me', href: '#concept' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 3D tilt state for profile photo
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0});
  const [isHovering, setIsHovering] = useState(false);
  const photoRef = useRef(null);

  const handlePhotoMouseMove = useCallback((e) => {
    if (!photoRef.current) return;
    const rect = photoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 24;
    const rotateX = (0.5 - y) * 24;
    setTilt({ rotateX, rotateY});
  }, []);

  const handlePhotoMouseEnter = useCallback(() => setIsHovering(true), []);
  const handlePhotoMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0});
  }, []);

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleContact = () => {
    setSubmitted(true);
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => setSubmitted(false), 4200);
  };

  const scrollToContact = () => scrollTo('#contact');
  const scrollToProjects = () => scrollTo('#projects');


  return (
    <main className="page-shell grain min-h-[100dvh] overflow-hidden">
      <header className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <button
          onClick={() => scrollTo('#top')}
          className="group flex items-center gap-2.5 text-left cursor-pointer"
          data-testid="button-brand-home"
          aria-label="Portfolio home"
        >
          <span className="grid h-7 w-7 place-items-center border border-[#a65ee8] text-[10px] font-bold text-[#b76cf4] transition-colors group-hover:bg-[#a65ee8] group-hover:text-[#100e16]">A</span>
          <span className="mono text-[11px] font-medium uppercase tracking-[.2em] text-[#e9e5dd]">Muhammad Alif Ramadhan</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <RandomLetterSwap
              key={item.href}
              className="mono text-[10px] uppercase text-[#97919e] hover:text-[#eeeae4] cursor-pointer"
              label={item.label}
              staggerDuration={0.025}
              transition={{ duration: 0.6, type: 'spring' }}
              onClick={() => scrollTo(item.href)}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
            />
          ))}
        </nav>

        <button
          onClick={scrollToContact}
          className="hidden border border-[#8b8493] px-4 py-2 text-[11px] uppercase tracking-[.12em] text-[#eeeae4] transition-all hover:border-[#b76cf4] hover:bg-[#b76cf4] hover:text-[#100e16] md:block cursor-pointer"
          data-testid="button-contact-header"
        >
          {submitted ? 'Message Sent' : 'Contact Me'}
        </button>

        <button
          onClick={() => setMenuOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center border border-[#37313f] text-[#eeeae4] md:hidden cursor-pointer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {menuOpen && (
        <div className="relative z-20 mx-6 border-y border-[#302938] bg-[#16121e]/95 px-5 py-5 backdrop-blur-md md:hidden" data-testid="mobile-navigation">
          <div className="flex flex-col gap-5">
            {navItems.map((item, index) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="flex items-center justify-between text-left text-sm uppercase tracking-[.14em] text-[#c9c2d1] cursor-pointer"
                data-testid={`link-mobile-${item.label.toLowerCase()}`}
              >
                <span><span className="mr-3 text-[10px] text-[#765388]">0{index + 1}</span>{item.label}</span>
                <ArrowUpRight size={15} />
              </button>
            ))}
            <button onClick={handleContact} className="mt-1 w-full border border-[#a65ee8] px-4 py-3 text-left text-[11px] uppercase tracking-[.15em] text-[#d69cff] cursor-pointer" data-testid="button-contact-mobile">
              {submitted ? 'Message Sent' : 'Get in Touch'}
            </button>
          </div>
        </div>
      )}

      {/* ini Hero section lur */}
      <section id="top" className="relative mx-auto min-h-[760px] max-w-[1440px] px-6 pb-16 md:min-h-[calc(100dvh-96px)] md:px-10 md:pb-10" aria-label="hero section">
        <div className="pointer-events-none absolute left-1/2 top-[7%] h-[620px] w-[min(92vw,1060px)] -translate-x-1/2 rounded-full bg-[#6c2c8b]/10 blur-[100px]" />
        <div className="absolute left-1/2 top-[5%] z-0 w-full -translate-x-1/2 space-y-8 text-center md:top-[3%]">
          <h1 className="display-title select-none whitespace-nowrap text-[25vw] text-[#4d4950]/45 tracking-[0.1em] md:text-[19vw] md:tracking-[24px] lg:text-[240px]">MUHAMMAD</h1>
          <h1 className="display-title -mt-[1vw] select-none whitespace-nowrap text-[25vw] text-[#4d4950]/45 tracking-[0.1em] md:text-[19vw] md:tracking-[24px] lg:text-[240px]">ALIF</h1>
          <h1 className="display-title -mt-[1vw] select-none whitespace-nowrap text-[25vw] text-[#4d4950]/45 tracking-[0.1em] md:text-[19vw] md:tracking-[24px] lg:text-[240px]">RAMADHAN</h1>
        </div>

        {/* ini section info di kiri */}
        <div className="relative z-10 grid min-h-[700px] grid-cols-1 md:min-h-[calc(100dvh-150px)] md:grid-cols-[1fr_1.1fr_1fr] md:items-center">
          <motion.div
            className="order-2 mt-[-5px] self-end pb-8 md:order-1 md:mt-28 md:pb-16"
            initial={{ opacity: 0, x: -120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mono mb-4 text-[9px] uppercase text-[#887f8e]">Future Programmer</p>
            <h2 className="script max-w-[420px] -rotate-3 text-[57px] leading-[.8] text-[#9b45d2] md:text-[76px]">Front End Developer</h2>
            <p className="script mt-5 text-[28px] text-[#eeeae4] md:text-[34px]">UI / UX</p>
            <div className="mt-8 max-w-[260px] border-l border-[#82509e] pl-4">
              <p className="mono text-[10px] uppercase leading-[1.7] text-[#d4ced8]">FEATURED WORK</p>
              <p className="mt-2 text-xs leading-relaxed text-[#7d7684]">Creating clean, scalable, and user-centered digital interfaces with React.</p>
            </div>
          </motion.div>

        {/* ini foto */}
          <div
            ref={photoRef}
            className="relative order-1 h-[510px] md:order-2 md:h-[700px] cursor-pointer"
            onMouseMove={handlePhotoMouseMove}
            onMouseEnter={handlePhotoMouseEnter}
            onMouseLeave={handlePhotoMouseLeave}
            style={{ perspective: '800px' }}
          >
            <div
              className={`photo-window ${isHovering ? '' : 'float-slow'}`}
              aria-label="Profile"
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovering ? 1.05 : 1})`,
                transition: isHovering
                  ? 'transform 0.1s ease-out'
                  : 'transform 0.6s cubic-bezier(.16,1,.3,1)',
                pointerEvents: 'auto',
              }}
            >
              <img src="/logo.png" alt="Profile" />
            </div>
          </div>

        {/* ini card project */}
          <motion.aside
            className="order-3 mt-[-20px] ml-auto w-[205px] border border-[#39313f] bg-[#1b1722]/80 p-5 backdrop-blur-sm md:mt-24 md:mb-0"
            initial={{ opacity: 0, x: 120 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b76cf4] shadow-[0_0_14px_rgba(183,108,244,.8)]" />
              <span className="mono text-[8px] uppercase text-[#716a78]">04 September 2026</span>
            </div>
            <h3 className="max-w-[130px] text-[19px] font-semibold uppercase leading-[.95] tracking-[-.04em] text-[#eeeae4]">Latest Project</h3>
            <p className="mt-4 text-[10px] leading-relaxed text-[#88808e]">You can check my latest project in PROJECT section, i try build website by applying my knowledge of front-end and UI/UX.</p>
            <button onClick={scrollToProjects} className="group mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[.1em] text-[#c581ef] cursor-pointer" data-testid="button-project-card">
              {submitted ? 'Inquired' : 'Check Project'} <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </motion.aside>
        </div>

      {/* ini scroll teks di bawah hero */}
        <motion.button
          onClick={() => scrollTo('#vision')}
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[#756d7c] transition-colors hover:text-[#b76cf4] md:flex cursor-pointer"
          data-testid="button-scroll-vision"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <span className="mono text-[8px] uppercase tracking-[.25em]">Scroll to enter</span>
          <ArrowDown size={15} strokeWidth={1} />
        </motion.button>
      </section>

      {/* ini vision section bolo */}
      <section id="vision" className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-36">
        <div className="hairline mb-12" />
        <div className="grid gap-12 md:grid-cols-[.8fr_1.4fr] md:items-end">

          <div className="reveal-delay-2 reveal">
            <p className="mono text-[9px] uppercase tracking-[.28em] text-[#a65ee8]">My Vision</p>
            <h2 className="mt-5 text-4xl font-semibold uppercase leading-[.9] tracking-[-.06em] text-[#e9e5dd] md:text-7xl">Building<br /><span className="text-[#77717d]">Clean Design</span></h2>
          </div>

          <p className="max-w-[440px] text-sm leading-[1.8] text-[#8c8591] md:justify-self-end">
            Crafting modern, visually striking interfaces with thoughtful component architecture and precision styling. 
            I prioritize user accessibility and intuitive layouts so every interface is instantly clear. 
            My core approach is combining strong visual aesthetics with a seamless user experience.
          </p>

        </div>
        
        <div className="mt-20 grid gap-px border-y border-[#302938] md:grid-cols-3">
          {[
            ['01', 'INTUITIVE LAYOUT', 'Organizing components thoughtfully so users never get lost or confused on their first visit.'],
            ['02', 'TAILORED STYLING', 'Selecting the perfect visual style and modern aesthetic tailored to match the product\'s identity.'],
            ['03', 'USER ACCESSIBILITY', 'Designing with clear structure and inclusive patterns so every user can navigate with ease.'],
          ].map(([number, title, copy]) => (
            <article className="group border-b border-[#302938] py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-0" key={number} data-testid={`card-feature-${number}`}>
              <span className="mono text-[10px] text-[#a65ee8]">{number}</span>
              <h3 className="mt-10 text-xl uppercase tracking-[-.04em] text-[#e9e5dd] transition-colors group-hover:text-[#bd75ed]">{title}</h3>
              <p className="mt-3 max-w-[230px] text-xs leading-relaxed text-[#7d7684]">{copy}</p>
            </article>
          ))}
        </div>
        
      </section>

      {/* ini about me section bolo */}
      <section id="concept" className="border-y border-[#302938] bg-[#14111b] px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[1fr_1fr] md:items-center">
          <div className="relative min-h-[300px] rounded-md overflow-hidden border border-[#302938] bg-[#0e0c13] p-6 md:min-h-[470px]">
            <span className="mono absolute left-6 top-6 z-10 text-[9px] uppercase text-[#FFFFFF]">About Me / Alif</span>
            <img 
              src="/aboutMe.jpeg" 
              alt="About Me" 
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c13] via-transparent to-transparent"/>
          </div>
          <div>
            <p className="mono text-[9px] uppercase tracking-[.28em] text-[#a65ee8]">Introduction</p>
            <p className="mt-6 text-3xl font-semibold uppercase leading-[.88] tracking-[-.07em] md:text-5xl">Passionate about code & crafting digital experiences.</p>
            <p className="mt-8 max-w-[500px] text-sm leading-[1.8] text-[#8c8591]">
              I have been deeply rooted in Computer Science since vocational high school through to my current university studies. 
              My journey includes working at Gramedia as a Web Designer and Scratch Game Developer, where I sharpened my visual design and logic building skills. 
              Highly adaptive and continuous in learning, I am always eager to explore new technologies to build intuitive digital products.</p>
            <button onClick={() => scrollTo('#projects')} className="group mt-10 flex items-center gap-3 border-b border-[#61576b] pb-2 text-[10px] uppercase tracking-[.16em] text-[#d3cbd9] transition-colors hover:border-[#b76cf4] hover:text-[#b76cf4] cursor-pointer" data-testid="button-read-concept">
              View My Experience <MoveRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ini project section */}
      <section id="projects" className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-36">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mono text-[9px] uppercase tracking-[.28em] text-[#a65ee8]">2026</p>
            <h2 className="mt-5 text-4xl font-semibold uppercase tracking-[-.06em] text-[#e9e5dd] md:text-6xl">Project.</h2>
          </div>
          <p className="mono text-[13px] uppercase tracking-[.12em] text-[#716a78]">Three Latest Project that i made.</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-[1.2fr_.8fr]">
          <motion.a
            href="https://github.com/ayiprmd/VClassTracker" 
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-md block min-h-[390px] overflow-hidden bg-[#241d2d] p-7 md:min-h-[540px]"
            data-testid="card-project-1"
            initial={{ opacity: 0, x: -100, y: 50 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <img
              src="/Project/project1.png"
              alt="VClass Tracker project preview"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100e16]/95 via-[#100e16]/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-between">
              <span className="mono text-[9px] uppercase text-[#e4c8ef]">01 / VClass Tracker</span>
              <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                <p className="mono text-5xl text-[#FFFFFF]">VClass Tracker.</p>
                <p className="mt-3 max-w-[240px] text-xs leading-relaxed text-[#e4dbe8]">A focused dashboard for tracking virtual-class schedules and activity.</p>
              </div>
            </div>
          </motion.a>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <motion.a
              href="https://github.com/ayiprmd/LandingPageV1" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-md min-h-[255px] overflow-hidden border border-[#302938] bg-[#17131f] p-6"
              data-testid="card-project-2"
              initial={{ opacity: 0, x: 100, y: -50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <img
                src="/Project/project2.png"
                alt="Portfolio website project preview"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100e16]/95 via-[#100e16]/25 to-transparent" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="mono text-[9px] uppercase text-[#e4c8ef]">02 / Portfolio Website</span>
                <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                  <p className="mono text-4xl text-[#ded3e2]">Personal presence.</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#d9cedd]">A responsive portfolio made to present work with clarity.</p>
                </div>
              </div>
            </motion.a>
            <motion.a
              href="" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-md min-h-[255px] overflow-hidden rounded-md border border-[#26212d] bg-[#1a1620] p-6"
              data-testid="card-project-3"
              initial={{ opacity: 0, x: 100, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <img
                src="/Project/ComingSoon.jpg"
                alt="Coming Soon project preview"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="relative flex h-full flex-col justify-between">
                <span className="mono text-[9px] uppercase text-[#716a78]">03 / Upcoming</span>
                <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                  <p className="mono text-4xl text-[#ded3e2]">On Progress.</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#756d7c]">Stay tuned for upcoming projects.</p>
                </div>
              </div>
            </motion.a>
          </div>
        </div>
        <div className="mt-14">
            <p className="mono text-[9px] uppercase tracking-[.28em] text-[#a65ee8]">2026</p>
            <h2 className="mt-5 text-4xl font-semibold uppercase tracking-[-.06em] text-[#e9e5dd] md:text-6xl">Certificate.</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {certificates.map((cert, index) => {
                const offsets = [
                  { x: -70, y: 40 },
                  { x: 0, y: 60 },
                  { x: 70, y: 40 },
                ];
                const offset = offsets[index % offsets.length];
                return (
                  <motion.div
                    key={cert.id}
                    className="group relative aspect-[4/3] rounded-md overflow-hidden border border-[#302938] bg-[#17131f] p-4 flex flex-col justify-between"
                    initial={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.2 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100e16]/90 via-transparent to-transparent" />
                    <span className="mono relative z-10 text-[9px] uppercase text-[#c7b5d1]">{cert.number} / Certificate</span>
                    <div className="relative z-10">
                      <p className="text-sm font-semibold uppercase text-[#e9e5dd]">{cert.title}</p>
                      <p className="text-[10px] text-[#7d7684]">{cert.issuer}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
        </div>
      </section>

      {/* ini contact section bolo */}
      <section id="contact" className="border-t border-[#302938] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <p className="mono text-[12px] uppercase tracking-[.28em] text-[#a65ee8]">IM AVAILABLE</p>
            <h2 className="mt-5 max-w-[700px] text-4xl font-semibold uppercase leading-[.85] tracking-[-.07em] text-[#FFFFFF] md:text-7xl">Let's work together.<br /><span className="text-[#FFFFFF]">Contact Me</span></h2>
          </div>
          <div className="max-w-[260px]">
            <p className="text-sm leading-relaxed text-[#8c8591]">Feel free to reach out for collaborations, project inquiries, or any questions.</p>
            <button onClick={handleContact} className="group mt-7 flex items-center gap-3 border border-[#a65ee8] px-5 py-3 text-[10px] uppercase tracking-[.14em] text-[#d7a0fa] transition-all hover:bg-[#a65ee8] hover:text-[#100e16] cursor-pointer" data-testid="button-contact-submit">
              {submitted ? <><Check size={14} /> Message Sent</> : <>Send Message <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>}
            </button>
          </div>
        </div>
      </section>

      {/* ini footer section bolo */}
      <footer className="mx-auto flex max-w-[1440px] flex-col gap-8 border-t border-[#302938] px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <span className="mono text-[9px] uppercase tracking-[.2em] text-[#716a78]">Muhammad Alif Ramadhan © 2026</span>
        <div className="flex gap-6">
          <button onClick={() => window.open('https://instagram.com/ayiprmd_', '_blank')} className="mono text-[9px] uppercase tracking-[.15em] text-[#716a78] transition-colors hover:text-[#e9e5dd] cursor-pointer" data-testid="link-instagram">Instagram</button>
          <button onClick={() => window.alert('Contact: aliframadhan@example.com')} className="mono text-[9px] uppercase tracking-[.15em] text-[#716a78] transition-colors hover:text-[#e9e5dd] cursor-pointer" data-testid="link-contact">Contact</button>
        </div>
        <button onClick={() => scrollTo('#top')} className="mono flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-[#716a78] transition-colors hover:text-[#e9e5dd] cursor-pointer" data-testid="button-back-top">Back to top <ArrowDown size={12} className="rotate-180" /></button>
      </footer> 

      {submitted && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 border border-[#71428a] bg-[#24132e] px-5 py-3 text-xs text-[#e4c8ef] shadow-2xl" role="status" data-testid="status-contact-success">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#a65ee8] text-[#160e1d]"><Check size={13} /></span>
          Your message has been sent. I&apos;ll get back to you soon.
        </div>
      )}
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
