
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Save, Share2, Download, Play, Pause, RefreshCw } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface SimulationParameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

interface LabInstruction {
  title: string;
  content: string;
}

interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface VirtualLab {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  instructions: LabInstruction[];
  parameters: SimulationParameter[];
  data: DataPoint[];
  createdAt: string;
  updatedAt: string;
}

// Helper function to safely parse JSON content
const parseLabContent = (content: Json): Partial<VirtualLab> => {
  try {
    if (typeof content === 'object' && content !== null) {
      return {
        instructions: (content.instructions as any[]) || [],
        parameters: (content.parameters as any[]) || [],
        data: (content.data as any[]) || []
      };
    }
    return {
      instructions: [],
      parameters: [],
      data: []
    };
  } catch (error) {
    console.error("Error parsing lab content:", error);
    return {
      instructions: [],
      parameters: [],
      data: []
    };
  }
};

// Helper function to convert VirtualLab data to Json compatible format
const convertLabToJson = (lab: Partial<VirtualLab>): Json => {
  return {
    instructions: lab.instructions,
    parameters: lab.parameters,
    data: lab.data
  } as Json;
};

// Demo virtual lab content for physics - pendulum simulation
const demoVirtualLab: VirtualLab = {
  id: "demo",
  title: "Pendulum Motion Simulator",
  subject: "Physics",
  grade: "High School",
  description: "Explore the principles of simple harmonic motion with this interactive pendulum simulation.",
  instructions: [
    {
      title: "Introduction",
      content: "A pendulum is a weight suspended from a pivot so that it can swing freely. When a pendulum is displaced from its resting equilibrium position, it is subject to a restoring force due to gravity that will accelerate it back toward the equilibrium position."
    },
    {
      title: "Experiment Goals",
      content: "1. Observe how changing the length of a pendulum affects its period.\n2. Understand the relationship between pendulum length and period.\n3. Verify the mathematical equation T = 2π√(L/g) where T is the period, L is the length, and g is the acceleration due to gravity."
    },
    {
      title: "Instructions",
      content: "1. Adjust the pendulum length using the slider.\n2. Click the 'Start' button to begin the simulation.\n3. Observe how the period changes with different lengths.\n4. Use the 'Reset' button to clear data and start over."
    }
  ],
  parameters: [
    {
      id: "length",
      name: "Pendulum Length",
      value: 1.0,
      min: 0.1,
      max: 3.0,
      step: 0.1,
      unit: "m"
    },
    {
      id: "gravity",
      name: "Gravity",
      value: 9.8,
      min: 1.0,
      max: 20.0,
      step: 0.1,
      unit: "m/s²"
    },
    {
      id: "amplitude",
      name: "Initial Amplitude",
      value: 15,
      min: 5,
      max: 45,
      step: 1,
      unit: "°"
    }
  ],
  data: [
    { x: 0, y: 0 },
    { x: 1, y: 0 }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const VirtualLabViewer = () => {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [lab, setLab] = useState<VirtualLab | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [parameters, setParameters] = useState<SimulationParameter[]>([]);
  const [data, setData] = useState<DataPoint[]>([]);
  const [activeTab, setActiveTab] = useState("simulation");
  
  useEffect(() => {
    const fetchLab = async () => {
      if (!contentId) {
        // Load demo content
        setLab(demoVirtualLab);
        setParameters(demoVirtualLab.parameters);
        setData(demoVirtualLab.data);
        setIsLoading(false);
        return;
      }

      try {
        const { data: labData, error } = await supabase
          .from("content")
          .select("*")
          .eq("id", contentId)
          .eq("type", "lab")
          .single();
        
        if (error) throw error;
        
        if (labData) {
          const labContent = parseLabContent(labData.content);
          const newLab: VirtualLab = {
            id: labData.id,
            title: labData.title,
            subject: labData.subject || "",
            grade: labData.grade_level || "",
            description: labData.description || "",
            instructions: labContent.instructions || [],
            parameters: labContent.parameters || [],
            data: labContent.data || [],
            createdAt: labData.created_at,
            updatedAt: labData.updated_at
          };
          
          setLab(newLab);
          setParameters(newLab.parameters);
          setData(newLab.data);
        }
      } catch (error) {
        console.error("Error fetching lab:", error);
        toast({
          title: "Error",
          description: "Failed to load lab. Using demo content instead.",
          variant: "destructive",
        });
        
        // Fallback to demo content
        setLab(demoVirtualLab);
        setParameters(demoVirtualLab.parameters);
        setData(demoVirtualLab.data);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLab();
  }, [contentId, toast]);
  
  // Setup canvas for visualization
  useEffect(() => {
    if (!canvasRef.current || !lab) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Initial draw
    drawPendulum(ctx, canvas.width, canvas.height);
    
    // Clean up animation on unmount
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lab, canvasRef]);
  
  useEffect(() => {
    if (isSimulating) {
      startSimulation();
    } else if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [isSimulating]);
  
  const drawPendulum = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!lab) return;
    
    const lengthParam = parameters.find(p => p.id === "length");
    const gravityParam = parameters.find(p => p.id === "gravity");
    const amplitudeParam = parameters.find(p => p.id === "amplitude");
    
    if (!lengthParam || !gravityParam || !amplitudeParam) return;
    
    const pendulumLength = lengthParam.value;
    const gravity = gravityParam.value;
    const amplitude = amplitudeParam.value * (Math.PI / 180); // Convert to radians
    
    // Calculate pendulum position
    const period = 2 * Math.PI * Math.sqrt(pendulumLength / gravity);
    const angle = amplitude * Math.cos(Math.sqrt(gravity / pendulumLength) * currentTime);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw pivot point
    const pivotX = width / 2;
    const pivotY = height * 0.2;
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Calculate bob position
    const scale = 100; // Scaling factor for visual length
    const bobX = pivotX + Math.sin(angle) * pendulumLength * scale;
    const bobY = pivotY + Math.cos(angle) * pendulumLength * scale;
    
    // Draw pendulum string
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();
    
    // Draw pendulum bob
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw information
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Time: ${currentTime.toFixed(2)}s`, 20, 30);
    ctx.fillText(`Period: ${period.toFixed(2)}s`, 20, 50);
    ctx.fillText(`Angle: ${(angle * (180 / Math.PI)).toFixed(2)}°`, 20, 70);
    
    // Update data if simulating
    if (isSimulating && currentTime % 0.1 < 0.02) { // Add data point every 0.1s approx
      setData(prevData => [...prevData, { x: currentTime, y: angle }]);
    }
  };
  
  const startSimulation = () => {
    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000; // Convert to seconds
      lastTime = time;
      
      setCurrentTime(prev => prev + deltaTime);
      
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawPendulum(ctx, canvas.width, canvas.height);
        }
      }
      
      if (isSimulating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const handleParameterChange = (paramId: string, value: number) => {
    setParameters(prevParams => 
      prevParams.map(param => 
        param.id === paramId ? { ...param, value } : param
      )
    );
  };
  
  const handleStartStop = () => {
    setIsSimulating(prev => !prev);
  };
  
  const handleReset = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsSimulating(false);
    setCurrentTime(0);
    setData([]);
    
    // Redraw the pendulum at initial state
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawPendulum(ctx, canvas.width, canvas.height);
      }
    }
  };
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save this lab.",
      });
      return;
    }
    
    if (!lab) return;
    
    setIsSaving(true);
    
    try {
      const updatedLab = {
        ...lab,
        parameters,
        data
      };
      
      const labContent = convertLabToJson(updatedLab);
      
      const { data: savedData, error } = await supabase
        .from("content")
        .insert({
          user_id: user.id,
          title: lab.title,
          type: "lab",
          subject: lab.subject,
          description: lab.description,
          grade_level: lab.grade,
          content: labContent,
          status: "published"
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Lab saved",
        description: "The virtual lab has been saved to your library.",
      });
      
      if (savedData) {
        navigate(`/labs/${savedData.id}`);
      }
    } catch (error) {
      console.error("Error saving lab:", error);
      toast({
        title: "Save failed",
        description: "Failed to save the lab. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleExport = () => {
    if (!lab) return;
    
    const labData = {
      ...lab,
      parameters,
      data,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(labData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${lab.title.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export successful",
      description: "The lab data has been exported as JSON.",
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (!lab) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">No lab found. Please return to the library and select another lab.</p>
          <Button className="w-full mt-4" onClick={() => navigate('/library')}>
            Back to Library
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{lab.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {lab.subject} • {lab.grade} • Virtual Lab
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export Data
            </Button>
            {lab.id === "demo" && (
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                Save
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
        <p className="mt-2 text-muted-foreground">{lab.description}</p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulation" className="space-y-4">
            <div className="bg-muted/40 rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {parameters.map((param) => (
                  <div key={param.id} className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor={param.id}>{param.name}</Label>
                      <span className="text-sm text-muted-foreground">
                        {param.value} {param.unit}
                      </span>
                    </div>
                    <Slider
                      id={param.id}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={[param.value]}
                      onValueChange={(values) => handleParameterChange(param.id, values[0])}
                      disabled={isSimulating}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                <Button onClick={handleStartStop} disabled={isLoading}>
                  {isSimulating ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
            
            <div className="border border-muted rounded-md h-80 relative">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="instructions">
            <div className="space-y-6">
              {lab.instructions.map((instruction, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-medium">{instruction.title}</h3>
                  <div className="whitespace-pre-line text-muted-foreground">
                    {instruction.content}
                  </div>
                  {index < lab.instructions.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="data">
            <div className="space-y-4">
              <div className="border border-muted rounded-md p-4 h-80 overflow-y-auto">
                <h3 className="font-medium mb-2">Recorded Data Points</h3>
                {data.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Time (s)</th>
                        <th className="text-left">Angle (rad)</th>
                        <th className="text-left">Angle (°)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((point, index) => (
                        <tr key={index} className="border-t">
                          <td>{point.x.toFixed(2)}</td>
                          <td>{point.y.toFixed(4)}</td>
                          <td>{(point.y * 180 / Math.PI).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted-foreground">No data recorded yet. Start the simulation to record data points.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VirtualLabViewer;
