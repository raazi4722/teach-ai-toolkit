
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS requests for CORS
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Sample data generators
const generateSampleQuiz = (topic: string, numQuestions: number = 4) => {
  // In a real implementation, this would call an AI service
  const bloomLevels = ["remember", "understand", "apply", "analyze", "evaluate", "create"];
  const questions = [];

  for (let i = 0; i < numQuestions; i++) {
    questions.push({
      id: `q${i + 1}`,
      question: `Sample question ${i + 1} about ${topic}?`,
      options: [
        `Option 1 for question ${i + 1}`,
        `Option 2 for question ${i + 1}`,
        `Option 3 for question ${i + 1}`,
        `Option 4 for question ${i + 1}`
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      bloomLevel: bloomLevels[Math.floor(Math.random() * bloomLevels.length)],
      explanation: `This is an explanation for question ${i + 1} about ${topic}.`
    });
  }

  return {
    title: `Quiz on ${topic}`,
    subject: topic.split(" ")[0],
    grade: "High School",
    questions
  };
};

const generateSampleLessonPlan = (topic: string) => {
  // In a real implementation, this would call an AI service
  return {
    title: `Introduction to ${topic}`,
    subject: topic.split(" ")[0],
    grade: "High School",
    duration: "45 minutes",
    objectives: [
      { id: "1", text: `Understand key concepts of ${topic}`, bloomLevel: "understand" },
      { id: "2", text: `Apply principles of ${topic} to solve problems`, bloomLevel: "apply" },
      { id: "3", text: `Analyze real-world scenarios related to ${topic}`, bloomLevel: "analyze" }
    ],
    sections: [
      {
        title: "Introduction and Warm-up",
        duration: "5 minutes",
        content: [
          `Begin with a brief introduction to ${topic}.`,
          "Engage students with an opening question."
        ]
      },
      {
        title: "Direct Instruction",
        duration: "15 minutes",
        content: [
          `Introduce core concepts of ${topic}.`,
          "Show examples and demonstrations.",
          "Encourage student questions."
        ]
      },
      {
        title: "Interactive Activity",
        duration: "15 minutes",
        content: [
          "Divide students into small groups.",
          `Have students work on ${topic} problems together.`,
          "Monitor progress and provide assistance."
        ]
      },
      {
        title: "Conclusion and Assessment",
        duration: "10 minutes",
        content: [
          `Summarize key takeaways about ${topic}.`,
          "Have students complete an exit ticket.",
          "Preview the next lesson."
        ]
      }
    ]
  };
};

// Main serve function
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse the request body
    const { topic, contentType, options } = await req.json();

    if (!topic || !contentType) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate content based on type
    let result;
    let model = "demo-model"; // In a real app, this would be the actual AI model used

    console.log(`Generating ${contentType} for topic: ${topic}`);

    switch (contentType) {
      case 'quiz':
        const numQuestions = options?.numQuestions || 4;
        result = generateSampleQuiz(topic, numQuestions);
        break;
      case 'lesson':
        result = generateSampleLessonPlan(topic);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unsupported content type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // In a production environment, this would log to your database
    console.log(`Successfully generated ${contentType} for "${topic}"`);

    // Return the generated content
    return new Response(JSON.stringify({ 
      success: true, 
      data: result, 
      model,
      generationTime: 1.2, // Mock time
      tokensUsed: 1024 // Mock token usage
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating content:', error);
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
