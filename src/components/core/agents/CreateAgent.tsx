import { Button } from "@/components/ui/button";
import { quickSuggestions, templates } from "@/constants";
import { ArrowUp, Plus } from "lucide-react";
import { useState } from "react";

const CreateAgent = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 my-2">
        <span className="text-2xl font-semibold tracking-tight mr-7">
          Create Agent
        </span>
        <span className="text-sm text-muted-foreground text-nowrap">
          Describe what type of agent you want to create. Type your goal, task
          or workflow
        </span>
      </div>
      {/* Prompt Textarea */}
      <div className="w-full border rounded-2xl bg-background p-3 shadow-lg">
        <textarea
          name="prompt"
          id="prompt"
          placeholder="Describe the agent that you want to create..."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-h-16 w-full resize-none bg-transparent px-3 py-3 text-sm outline-none"
        ></textarea>
        <div className="flex justify-between items-center">
          <div>
            <Button variant={"ghost"} size={"icon"}>
              <Plus />
            </Button>
          </div>
          <Button size={"icon"}>
            <ArrowUp />
          </Button>
        </div>
      </div>
      {/* Quick Suggestions */}
      <div className="w-full flex flex-row gap-4">
        {quickSuggestions.map((suggestion) => (
          <Button
            variant={"secondary"}
            key={suggestion.id}
            className="p-4"
            onClick={() => setPrompt(suggestion.prompt)}
          >
            {suggestion.label}
          </Button>
        ))}
      </div>
      {/* Templates */}
      <div className="my-6 flex flex-col gap-6">
        <span className="flex justify-between items-center">
          <span className="text-xl font-semibold text-accent-foreground/60">
            Get Started
          </span>
          <span className="text-sm font-medium">View All</span>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border bg-background py-3 px-4 rounded-2xl hover:bg-accent-foreground/5"
            >
              <template.icon />
              <div className="mt-2">
                <h4 className="font-semibold text-foreground">
                  {template.title}
                </h4>
                <p className="text-sm leading-5 text-muted-foreground">
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
