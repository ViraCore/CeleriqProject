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
    techStack: ["Python", "TensorFlow", "3D Reconstruction", "Medical Imaging"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-1.mp4",
    thumbnail: "/placeholder.svg",
    category: "Medical AI",
    accentColor: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    title: "Skin Disease Detection",
    description: "Machine learning-powered diagnostic tool for early detection and classification of skin conditions. Uses advanced computer vision and deep learning to analyze dermatological images and provide instant clinical insights.",
    techStack: ["Deep Learning", "CNN", "Flask", "OpenCV"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-2.mp4",
    thumbnail: "/placeholder.svg",
    category: "Healthcare AI",
    accentColor: "from-rose-500 to-pink-600"
  },
  {
    id: 3,
    title: "Head and Neck Segmentation",
    description: "Automated medical image segmentation system for precision radiotherapy planning. Accurately identifies and delineates anatomical structures in CT/MRI scans to optimize cancer treatment protocols.",
    techStack: ["U-Net", "PyTorch", "Medical Imaging", "DICOM"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-3.mp4",
    thumbnail: "/placeholder.svg",
    category: "Medical AI",
    accentColor: "from-emerald-500 to-teal-600"
  },
  {
    id: 4,
    title: "Homer",
    description: "Intelligent rental marketplace revolutionizing property search with AI-powered lifestyle filters. Features bidirectional matching where renters can find properties or post requirements for owners to apply. Analyzes real-world comfort factors including safety, commute, noise levels, and local amenities for optimal home selection.",
    techStack: ["React", "Tailwind CSS", "PostCSS", "CRACO", "React Router", "Axios", "Framer Motion", "Chart.js", "Lucide React", "MySQL", "Redis", "Stripe", "Razorpay", "Netlify", "i18n"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-4.mp4",
    thumbnail: "/placeholder.svg",
    category: "Web Application",
    accentColor: "from-violet-500 to-purple-600"
  },
  {
    id: 5,
    title: "Mock Interview Platform",
    description: "AI-powered interview preparation platform delivering personalized coaching with real-time feedback. Features intelligent question generation, performance analytics, and adaptive learning for both technical and behavioral interview mastery.",
    techStack: ["React", "FastAPI", "OpenAI", "WebRTC"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-5.mp4",
    thumbnail: "/placeholder.svg",
    category: "EdTech AI",
    accentColor: "from-amber-500 to-orange-600"
  },
  {
    id: 6,
    title: "Cancer Website",
    description: "Comprehensive cancer awareness and information portal dedicated to empowering patients and families. Provides evidence-based educational resources, treatment options, survivor stories, and access to a supportive community network.",
    techStack: ["React", "Tailwind CSS", "Strapi CMS", "PostgreSQL"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-6.mp4",
    thumbnail: "/placeholder.svg",
    category: "Healthcare Portal",
    accentColor: "from-red-500 to-rose-600"
  },
  {
    id: 7,
    title: "Gee Ess Opticals",
    description: "Modern e-commerce platform transforming eyewear retail with cutting-edge technology. Features digital prescription management, seamless payment integration, and personalized product recommendations for the perfect frame selection.",
    techStack: ["React", "Tailwind CSS", "PostCSS", "CRACO", "React Router", "Axios",  "Lucide React", "PWA", "Stripe", "Razorpay", "Python", "MySQL", "Redis", "Netlify", "i18n"],
    liveLink: "https://geeessopticals.netlify.app",
    videoPath: "/videos/projects/project-7.mp4",
    thumbnail: "/placeholder.svg",
    category: "E-commerce",
    accentColor: "from-indigo-500 to-blue-600"
  },
  {
    id: 8,
    title: "Rajasthan Diamonds Website",
    description: "Elegant jewelry showcase website featuring stunning visuals and smooth animations. Showcases exquisite diamond collections with high-resolution imagery, custom design consultation, and streamlined inquiry management for luxury clientele.",
    techStack: ["React", "Next.js", "Framer Motion", "Sanity CMS"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-8.mp4",
    thumbnail: "/placeholder.svg",
    category: "E-commerce",
    accentColor: "from-yellow-500 to-amber-600"
  },
  {
    id: 9,
    title: "Brain Tumor AI Diagnostic Tool",
    description: "Advanced MRI analysis platform powered by artificial intelligence for accurate brain tumor detection and classification. Utilizes state-of-the-art deep learning models to assist radiologists in early diagnosis, tumor segmentation, and treatment planning with unprecedented precision.",
    techStack: ["Deep Learning", "CNN", "TensorFlow", "PyTorch", "Medical Imaging", "DICOM", "MRI Analysis", "U-Net", "ResNet"],
    liveLink: "#", // Update with your actual link
    videoPath: "/videos/projects/project-9.mp4",
    thumbnail: "/placeholder.svg",
    category: "Medical AI",
    accentColor: "from-purple-500 to-indigo-600"
  }
];
