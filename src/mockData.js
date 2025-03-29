// src/mockData.js
const careerTitles = [
  "Remote Job Success", "Dealing with Burnout", "Salary Negotiation Tips", "Career Switch Advice", "Workplace Confidence"
];
const careerContents = [
  "I just landed a remote job with flexible hours—perfect for balancing motherhood!",
  "How do you cope with burnout in a male-dominated field?",
  "Negotiated my salary up 20%—here’s how I did it...",
  "Thinking of switching careers at 35—any tips?",
  "Struggling with imposter syndrome at work lately..."
];

const healthTitles = [
  "Mental Health Struggles", "Fitness for Busy Moms", "Finding Good Therapy", "Postpartum Recovery", "Stress Relief Ideas"
];
const healthContents = [
  "I’ve been battling anxiety since my last breakup—any tips?",
  "Quick workouts that fit into a chaotic schedule...",
  "Found an amazing therapist—should I share her contact?",
  "Three months postpartum and still feeling off...",
  "Meditation has been a game-changer for my stress levels!"
];

const safetyTitles = [
  "Nighttime Safety Tips", "Escaping Harassment", "Safe Spaces Nearby", "Self-Defense Basics", "Online Privacy"
];
const safetyContents = [
  "I feel uneasy walking home alone—any safety hacks?",
  "Reported street harassment anonymously—here’s how it went...",
  "List of verified shelters in my city—hope it helps!",
  "Learned some self-defense moves last week...",
  "How to protect your identity online—sharing what I know."
];

const legalTitles = [
  "Divorce Advice Needed", "Know Your Rights", "Affordable Legal Help", "Workplace Laws", "Tenant Issues"
];
const legalContents = [
  "Going through a messy divorce—any advice on custody battles?",
  "Your rights during a workplace dispute—learned this the hard way...",
  "Free legal aid services I found helpful in my area...",
  "Boss keeps denying my leave—legal options?",
  "Landlord won’t fix the heat—what can I do?"
];

const generalComments = [
  "Thanks for sharing this!", "Has anyone else tried this?", "This deserves more upvotes!", "Love this community!"
];
const commentAddons = {
  Career: ["What field are you in?", "Networking helped me too!"],
  Health: ["Have you talked to a doctor?", "Self-care is key!"],
  Safety: ["Stay safe out there!", "Trust your gut!"],
  Legal: ["Check your local laws!", "Lawyer up if you can!"]
};

const resourceTypes = {
  Career: ["support-group", "hotline"],
  Health: ["clinic", "support-group", "hotline"],
  Safety: ["shelter", "hotline", "support-group"],
  Legal: ["legal-aid", "hotline"]
};

const mediaCaptions = {
  Career: ["Job fair photo", "Resume workshop"],
  Health: ["Yoga session", "Health talk"],
  Safety: ["Self-defense class", "Safety map"],
  Legal: ["Legal seminar", "Rights infographic"]
};

function generatePost(id) {
  const categories = ["Career", "Health", "Safety", "Legal"];
  const category = categories[Math.floor(Math.random() * categories.length)];

  let title, content;
  switch (category) {
    case "Career":
      title = careerTitles[Math.floor(Math.random() * careerTitles.length)];
      content = careerContents[Math.floor(Math.random() * careerContents.length)];
      break;
    case "Health":
      title = healthTitles[Math.floor(Math.random() * healthTitles.length)];
      content = healthContents[Math.floor(Math.random() * healthContents.length)];
      break;
    case "Safety":
      title = safetyTitles[Math.floor(Math.random() * safetyTitles.length)];
      content = safetyContents[Math.floor(Math.random() * safetyContents.length)];
      break;
    case "Legal":
      title = legalTitles[Math.floor(Math.random() * legalTitles.length)];
      content = legalContents[Math.floor(Math.random() * legalContents.length)];
      break;
  }

  // 40% chance to append a question
  if (Math.random() < 0.4) {
    const questions = [
      "Any advice?",
      "Has anyone else been through this?",
      "What do you think?",
      "Is this normal?"
    ];
    content += " " + questions[Math.floor(Math.random() * questions.length)];
  }

  const comments = Array.from({ length: Math.floor(Math.random() * 11) }, (_, j) => {
    let comment = generalComments[Math.floor(Math.random() * generalComments.length)];
    if (Math.random() > 0.5) {
      const addon = commentAddons[category][Math.floor(Math.random() * commentAddons[category].length)];
      comment += " " + addon;
    }
    return {
      id: `c${id}-${j + 1}`,
      content: comment,
      upvotes: Math.floor(Math.random() * 50),
      downvotes: Math.floor(Math.random() * 10),
      anonymous: Math.random() > 0.5
    };
  });

  const resources = Math.random() < 0.3 ? {
    type: resourceTypes[category][Math.floor(Math.random() * resourceTypes[category].length)],
    location: `Near ${["Downtown", "Uptown", "Suburbs"][Math.floor(Math.random() * 3)]}`,
    verified: Math.random() < 0.8
  } : null;

  const media = Math.random() < 0.2 ? {
    image: `https://via.placeholder.com/600x400?text=${category}`,
    caption: mediaCaptions[category][Math.floor(Math.random() * mediaCaptions[category].length)]
  } : null;

  return {
    id: id.toString(),
    title,
    content,
    category,
    upvotes: Math.floor(Math.random() * 200),
    downvotes: Math.floor(Math.random() * 50),
    comments,
    anonymous: Math.random() > 0.5,
    resources,
    media,
    date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString()
  };
}

export const mockPosts = Array.from({ length: 25 }, (_, i) => generatePost(i + 1));