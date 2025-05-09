
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// Define type for request body
interface GenerationRequest {
  topic: string;
  gradeLevel: string;
  contentType: string;
  additionalContext?: string;
  videoUrl?: string;
  subject?: string;
}

// Define structure for quiz questions
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  bloomLevel: "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";
  explanation: string;
}

// Define structure for lab parameters
interface LabParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

// Define structure for lab instructions
interface LabInstruction {
  title: string;
  content: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    });
  }
  
  // Get Supabase client using environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Extract the JWT token from the request
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  // Get the current user from the JWT token
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  
  if (userError || !user) {
    return new Response(
      JSON.stringify({ error: "Invalid token or user not found" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  try {
    const requestData: GenerationRequest = await req.json();
    const { topic, gradeLevel, contentType, additionalContext = "", videoUrl = "", subject = "" } = requestData;
    
    // Input validation
    if (!topic || !gradeLevel || !contentType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Mock content generation (replace with actual AI generation)
    let generatedContent;
    let title = `${topic} ${contentType}`;
    
    if (contentType === "quiz") {
      // Generate mock quiz questions
      const questions: QuizQuestion[] = [
        {
          id: `q${Math.random().toString(36).substring(2, 10)}`,
          question: `What is the main principle behind ${topic}?`,
          options: [
            `The principle of conservation`,
            `The principle of relativity`,
            `The principle of uncertainty`,
            `The principle of entropy`
          ],
          correctAnswer: 0,
          bloomLevel: "understand",
          explanation: `The principle of conservation is fundamental to understanding ${topic}.`
        },
        {
          id: `q${Math.random().toString(36).substring(2, 10)}`,
          question: `How would you apply ${topic} to solve a real-world problem?`,
          options: [
            `Through mathematical modeling`,
            `Using experimental techniques`,
            `By developing a theoretical framework`,
            `All of the above`
          ],
          correctAnswer: 3,
          bloomLevel: "apply",
          explanation: `${topic} can be applied using various approaches, including mathematical modeling, experimental techniques, and theoretical frameworks.`
        },
        {
          id: `q${Math.random().toString(36).substring(2, 10)}`,
          question: `Which of the following best analyzes the relationship between ${topic} and related concepts?`,
          options: [
            `They are fundamentally unrelated`,
            `They share core principles but differ in application`,
            `They are identical in all contexts`,
            `The relationship varies depending on the field`
          ],
          correctAnswer: 1,
          bloomLevel: "analyze",
          explanation: `${topic} shares core principles with related concepts but differs in specific applications across various contexts.`
        }
      ];
      
      generatedContent = { questions };
      title = `${topic} Quiz`;
      
    } else if (contentType === "lab") {
      // Generate mock lab content
      const instructions: LabInstruction[] = [
        {
          title: "Introduction",
          content: `This lab explores ${topic} through interactive simulation. Students will learn the fundamental principles and practical applications.`
        },
        {
          title: "Objectives",
          content: `1. Understand the key principles of ${topic}\n2. Apply theoretical knowledge to practical scenarios\n3. Analyze the relationship between variables\n4. Evaluate results and draw conclusions`
        },
        {
          title: "Procedure",
          content: `1. Set up the initial parameters\n2. Run the simulation and observe changes\n3. Record data at regular intervals\n4. Analyze results and identify patterns\n5. Draw conclusions based on observations`
        }
      ];
      
      const parameters: LabParameter[] = [
        {
          id: "param1",
          name: "Initial Value",
          value: 10,
          min: 0,
          max: 100,
          step: 1,
          unit: "units"
        },
        {
          id: "param2",
          name: "Rate",
          value: 2,
          min: 0.1,
          max: 10,
          step: 0.1,
          unit: "units/s"
        },
        {
          id: "param3",
          name: "Time Scale",
          value: 1,
          min: 0.1,
          max: 5,
          step: 0.1,
          unit: "x"
        }
      ];
      
      generatedContent = {
        instructions,
        parameters,
        data: [{ x: 0, y: 0 }, { x: 1, y: 0 }]
      };
      
      title = `${topic} Virtual Lab`;
      
    } else {
      // Generate mock lesson plan or other content
      generatedContent = {
        overview: `This ${contentType} covers ${topic} for ${gradeLevel} students.`,
        objectives: [
          `Understand the fundamental concepts of ${topic}`,
          `Apply ${topic} principles to solve problems`,
          `Analyze the implications of ${topic} in real-world scenarios`
        ],
        resources: [
          "Textbook chapters 1-3",
          "Online interactive tools",
          "Handout materials"
        ],
        assessment: "Formative assessment through discussion and practice problems."
      };
    }
    
    // Save the generated content to the database
    const { data, error } = await supabase
      .from("content")
      .insert({
        user_id: user.id,
        title,
        type: contentType,
        subject,
        grade_level: gradeLevel,
        description: `AI-generated ${contentType} about ${topic} for ${gradeLevel} students.`,
        bloom_tags: ["understand", "apply", "analyze"],
        content: generatedContent,
        status: "published"
      })
      .select()
      .single();
    
    if (error) {
      console.error("Database error:", error);
      throw new Error("Failed to save generated content");
    }
    
    // Track the AI generation for analytics
    await supabase
      .from("ai_generations")
      .insert({
        user_id: user.id,
        prompt: JSON.stringify({ topic, gradeLevel, contentType, additionalContext, videoUrl }),
        result: generatedContent,
        model: "mock-ai-model",
        tokens_used: 0,
        generation_time: 0.5
      });
    
    // Return the ID of the new content
    return new Response(
      JSON.stringify({ 
        message: "Content generated successfully", 
        contentId: data.id,
        contentType
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
