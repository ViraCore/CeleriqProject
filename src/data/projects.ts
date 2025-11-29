// Project Data Configuration
// Update this file with your actual project details, videos, and links

export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  liveLink: string;
  videoPath: string; // Path to video file in /public/videos/projects/
  thumbnail: string; // Fallback image if video not available
  category: string;
  accentColor: string; // Tailwind color class for theming
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Skull Reconstruction",
    description: "Advanced medical imaging application using AI to reconstruct 3D skull models from CT scans. Helps surgeons plan complex craniofacial procedures with precision and accuracy.",
    techStack: ["Python", "TensorFlow", "OpenCV", "DICOM", "Flask", "3D Visualization"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-1.mp4",
    thumbnail: "/image/project-1-thumbnail.jpg",
    category: "Medical AI",
    accentColor: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    title: "Skin Disease Detection",
    description: "Machine learning-powered diagnostic tool for early detection and classification of skin conditions. Uses advanced computer vision and deep learning to analyze dermatological images and provide instant clinical insights.",
    techStack: ["Python", "TensorFlow", "Flask", "OpenCV", "React", "MongoDB"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-2.mp4",
    thumbnail: "/image/project-2-thumbnail.jpg",
    category: "Healthcare AI",
    accentColor: "from-rose-500 to-pink-600"
  },
  {
    id: 3,
    title: "Head and Neck Segmentation",
    description: "Automated medical image segmentation system for precision radiotherapy planning. Accurately identifies and delineates anatomical structures in CT/MRI scans to optimize cancer treatment protocols.",
    techStack: ["Python", "PyTorch", "DICOM", "FastAPI", "React", "Medical Imaging"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-3.mp4",
    thumbnail: "/image/project-3-thumbnail.jpg",
    category: "Medical AI",
    accentColor: "from-emerald-500 to-teal-600"
  },
  {
    id: 4,
    title: "Homer",
    description: "Intelligent rental marketplace revolutionizing property search with AI-powered lifestyle filters. Features bidirectional matching where renters can find properties or post requirements for owners to apply. Analyzes real-world comfort factors including safety, commute, noise levels, and local amenities for optimal home selection.",
    techStack: ["React", "Node.js", "MySQL", "Redis", "Stripe", "AI/ML", "Tailwind CSS"],
    liveLink: "https://ownerrenter.netlify.app/", // Update with your actual link
    videoPath: "/videos/projects/project-4.mp4",
    thumbnail: "/image/project-4-thumbnail.jpg",
    category: "Web Application",
    accentColor: "from-violet-500 to-purple-600"
  },
  {
    id: 5,
    title: "Mock Interview Platform",
    description: "AI-powered interview preparation platform delivering personalized coaching with real-time feedback. Features intelligent question generation, performance analytics, and adaptive learning for both technical and behavioral interview mastery.",
    techStack: ["React", "FastAPI", "OpenAI GPT-4", "WebRTC", "MongoDB", "Python"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-5.mp4",
    thumbnail: "/image/project-5-thumbnail.jpg",
    category: "EdTech AI",
    accentColor: "from-amber-500 to-orange-600"
  },
  {
    id: 6,
    title: "Cancer Website",
    description: "A cancer care portal featuring AI-driven diagnosis, patient and doctor connectivity, automated reports, and chatbots—built to streamline treatment and improve accessibility to critical healthcare services.",
    techStack: ["React", "Strapi CMS", "PostgreSQL", "Node.js", "Tailwind CSS", "GraphQL"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-6.mp4",
    thumbnail: "/image/project-6-thumbnail.jpg",
    category: "Healthcare Portal",
    accentColor: "from-red-500 to-rose-600"
  },
  {
    id: 7,
    title: "Gee Ess Opticals",
    description: "Modern e-commerce platform transforming eyewear retail with cutting-edge technology. Features digital prescription management, seamless payment integration, and personalized product recommendations for the perfect frame selection.",
    techStack: ["React", "Python", "MySQL", "Redis", "Stripe", "PWA", "Tailwind CSS"],
    liveLink: "https://geeessopticals.netlify.app",
    videoPath: "/videos/projects/project-7.mp4",
    thumbnail: "/image/project-7-thumbnail.jpg",
    category: "E-commerce",
    accentColor: "from-indigo-500 to-blue-600"
  },
  {
    id: 8,
    title: "Rajasthan Diamonds Website",
    description: "Elegant jewelry showcase website featuring stunning visuals and smooth animations. Showcases exquisite diamond collections with high-resolution imagery, custom design consultation, and streamlined inquiry management for luxury clientele.",
    techStack: ["Next.js", "React", "Sanity CMS", "Framer Motion", "TypeScript", "Tailwind CSS"],
    liveLink: "https://jewelerystore1246.netlify.app/", // Update with your actual link
    videoPath: "/videos/projects/project-8.mp4",
    thumbnail: "/image/project-8-thumbnail.jpg",
    category: "E-commerce",
    accentColor: "from-yellow-500 to-amber-600"
  },
  {
    id: 9,
    title: "Brain Tumor AI Diagnostic Tool",
    description: "Advanced MRI analysis platform powered by artificial intelligence for accurate brain tumor detection and classification. Utilizes state-of-the-art deep learning models to assist radiologists in early diagnosis, tumor segmentation, and treatment planning with unprecedented precision.",
    techStack: ["Python", "PyTorch", "DICOM", "Medical Imaging", "FastAPI", "React"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-9.mp4",
    thumbnail: "/image/project-9-thumbnail.jpg",
    category: "Medical AI",
    accentColor: "from-purple-500 to-indigo-600"
  }
];
