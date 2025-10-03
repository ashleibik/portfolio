// Navigation Bar SECTION
const navBar = { show: true };

// Main Body SECTION
const mainBody = {
  gradientColors: "#4484ce, #1ad7c0, #ff9b11, #9b59b6, #ff7f7f, #ecf0f1",
  firstName: "Ahmed",
  middleName: "",
  lastName: "Shleibik",
  message: " Passionate about changing the world with technology. ",
  icons: [
    { image: "fa-github",   url: "https://github.com/ashleibik" },
    { image: "fa-linkedin", url: "https://www.linkedin.com/in/shleibik/" },
    { image: "fa-envelope", url: "mailto:ashleibik@gmail.com" },
  ],
};

// ABOUT SECTION
const about = {
  show: true,
  heading: "About Me",
  imageLink: require("./headshot.jpg"), // your file in src/editable-stuff/
  imagesize: 355,                        // ← use lowercase “imagesize”
  message:
    "I’m Ahmed Shleibik from Calgary. I do IT support and software development. I like solving real user problems, building small apps with Java/Python/JS, and working with networking tools like Wireshark and Packet Tracer. Outside tech: soccer, hiking, and photography.",
  resume: "https://drive.google.com/file/d/1vrNHMP34SVCLAdwMHjPyjv-vxC4Um5Bc/view",
};


// PROJECTS SECTION
const repos = {
  show: true,
  heading: "Recent Projects",
  gitHubUsername: "ashleibik",
  reposLength: 4,
  specificRepos: [],
};

// Leadership SECTION
const leadership = {
  show: false,
  heading: "Leadership",
  message:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  images: [
    { img: require("./headshot.jpg"), label: "First slide label",  paragraph: "Nulla vitae elit libero, a pharetra augue mollis interdum." },
    { img: require("./headshot.jpg"), label: "Second slide label", paragraph: "Nulla vitae elit libero, a pharetra augue mollis interdum." },
  ],
  imageSize: { width: "615", height: "450" },
};

// SKILLS SECTION
const skills = {
  show: true,
  heading: "Skills",
  hardSkills: [
    { name: "Python", value: 90 },
    { name: "SQL", value: 75 },
    { name: "Data Structures", value: 85 },
    { name: "C/C++", value: 65 },
    { name: "JavaScript", value: 90 },
    { name: "HTML/CSS", value: 55 },
  ],
  softSkills: [
    { name: "Goal-Oriented", value: 80 },
    { name: "Collaboration", value: 90 },
    { name: "Positivity", value: 75 },
    { name: "Adaptability", value: 85 },
    { name: "Problem Solving", value: 75 },
    { name: "Empathy", value: 90 },
    { name: "Organization", value: 70 },
    { name: "Creativity", value: 90 },
  ],
};

// GET IN TOUCH SECTION
const getInTouch = {
  show: true,
  heading: "Get In Touch",
  message:
    "Seeking 2026 internships in Software Development, Cyber Security, Data, or related fields.",
  email: "ashleibik@gmail.com",
};

// Experiences (hidden)
const experiences = {
  show: false,
  heading: "Experiences",
  data: [],
};

export { navBar, mainBody, about, repos, skills, leadership, getInTouch, experiences };