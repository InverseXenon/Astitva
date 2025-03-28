// src/mockData.js
export const mockPosts = Array.from({ length: 25 }, (_, i) => ({
    id: (i + 1).toString(),
    title: [
      "Remote Work Opportunities",
      "Mental Health Support Groups",
      "Safety Reporting Guide",
      "Legal Rights Workshop",
      "Freelancing Tips",
      "Emergency Shelter Locations"
    ][i % 6],
    content: [
      "Sharing companies offering flexible work arrangements for women...",
      "Local support groups for postpartum depression...",
      "Step-by-step guide for reporting incidents anonymously...",
      "Understanding workplace discrimination laws...",
      "Building freelance career while managing family...",
      "Map of verified women's shelters in urban areas..."
    ][i % 6],
    category: ['Career', 'Health', 'Safety', 'Legal'][Math.floor(Math.random() * 4)],
    upvotes: Math.floor(Math.random() * 150) + 5,
    downvotes: Math.floor(Math.random() * 30),
    comments: Array.from({ length: Math.floor(Math.random() * 8) + 1 }, (_, j) => ({
      id: `c${i + 1}-${j + 1}`,  // Fixed template literal syntax
      content: [
        "This helped me so much!",
        "Anyone tried this recently?",
        "Important resource, thanks!",
        "Needs more regional info",
        "Verified this works in 2024",
        "Contact info for support?"
      ][j % 6],
      upvotes: Math.floor(Math.random() * 20),
      downvotes: Math.floor(Math.random() * 5),
      anonymous: Math.random() > 0.5
    })),
    anonymous: Math.random() > 0.5,
    resources: Math.random() > 0.5 ? {
      type: ['shelter', 'clinic', 'legal-aid'][Math.floor(Math.random() * 3)],
      location: `City Center ${Math.floor(Math.random() * 100)}`,  // Fixed template literal
      verified: Math.random() > 0.2
    } : null,
    media: Math.random() > 0.5 ? {
      image: `https://via.placeholder.com/600x400?text=${['Shelter', 'Clinic', 'Workshop', 'Support'][i % 4]}`,  // Fixed URL
      caption: [
        "Safe space location",
        "Free health checkup center",
        "Legal rights workshop",
        "Career development session"
      ][i % 4]
    } : null
  }));