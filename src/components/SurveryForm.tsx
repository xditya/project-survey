"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const questions = [
  {
    title: "Printing Services",
    questions: [
      {
        id: "printRating",
        label: "How would you rate the current printing services on campus?",
        type: "rating",
        required: true,
      },
      {
        id: "printDelays",
        label: "Have you faced any delays in getting your printouts?",
        type: "yesno",
        required: true,
      },
      {
        id: "printImprovements",
        label:
          "What improvements would you suggest for the current printing facilities?",
        type: "text",
        required: false,
      },
    ],
  },
  {
    title: "College Slips",
    questions: [
      {
        id: "slipRating",
        label: "How would you rate the current college slip services?",
        type: "rating",
        required: true,
      },
      {
        id: "slipDelays",
        label: "Have you faced any delays in getting your college slips?",
        type: "yesno",
        required: true,
      },
      {
        id: "slipImprovements",
        label:
          "What improvements would you suggest for the college slip services?",
        type: "text",
        required: false,
      },
    ],
  },
  {
    title: "College Canteen",
    questions: [
      {
        id: "canteenRating",
        label: "How would you rate the current college canteen services?",
        type: "rating",
        required: true,
      },
      {
        id: "canteenDelays",
        label: "Have you faced any delays in getting your food at the canteen?",
        type: "yesno",
        required: true,
      },
      {
        id: "canteenImprovements",
        label: "What improvements would you suggest for the college canteen?",
        type: "text",
        required: false,
      },
    ],
  },
];

const departmentOptions = ["CSE", "CS AI", "ECE", "EEE", "ME", "CE"];
const classOptions = [1, 2];
const yearOptions = Array.from({ length: 6 }, (_, i) => (2025 + i).toString());

export default function SurveyForm() {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState<{
    name: string;
    department: string;
    classNumber: number;
    yearOfPassing: string;
    [key: string]: string | number;
  }>({
    name: "",
    department: "",
    classNumber: 0,
    yearOfPassing: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSubmission = async () => {
      const response = await fetch("/api/check-submission");
      if (response.ok) {
        const { hasSubmitted } = await response.json();
        if (hasSubmitted) {
          router.push("/thank-you");
        }
      }
    };
    checkSubmission();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (id: string, value: number) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleYesNoChange = (id: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (page == 0) return setPage(1);
    if (page < questions.length) {
      const responses = questions[page - 1].questions.map(
        (question) => formData[question.id]
      );
      for (let i = 0; i < responses.length; i++) {
        if (i == 2) {
          continue;
        }
        if (responses[i] === undefined) {
          return alert("Please fill all required fields");
        }
      }
      setPage(page + 1);
    } else {
      const responses = questions[page - 1].questions.map(
        (question) => formData[question.id]
      );
      for (let i = 0; i < responses.length; i++) {
        if (i == 2) {
          continue;
        }
        if (responses[i] === undefined) {
          return alert("Please fill all required fields");
        }
      }
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/submit-survey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          router.push("/thank-you");
        } else {
          const error = await response.json();
          throw new Error(error.message || "Failed to submit survey");
        }
      } catch (error) {
        alert(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const renderQuestion = (question: {
    id: string;
    label: string;
    type: string;
    required: boolean;
  }) => {
    switch (question.type) {
      case "rating":
        return (
          <div key={question.id} className="space-y-2">
            <Label>
              {question.label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`cursor-pointer ${
                    rating <=
                    (typeof formData[question.id] === "number"
                      ? (formData[question.id] as number)
                      : 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(question.id, rating)}
                />
              ))}
            </div>
          </div>
        );
      case "yesno":
        return (
          <div key={question.id} className="space-y-2">
            <Label>
              {question.label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => handleYesNoChange(question.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                <Label htmlFor={`${question.id}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${question.id}-no`} />
                <Label htmlFor={`${question.id}-no`}>No</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case "text":
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>
              {question.label}{" "}
              {question.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={question.id}
              name={question.id}
              onChange={handleChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Campus Survey</CardTitle>
          <CardDescription>Help us improve our campus services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {page === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input id="name" name="name" onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("department", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classNumber">
                  Class <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("classNumber", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((option) => (
                      <SelectItem key={option} value={option.toString()}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearOfPassing">
                  Year of Passing <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("yearOfPassing", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year of passing" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {page > 0 && page <= questions.length && (
            <>
              <h2 className="text-xl font-semibold">
                {questions[page - 1].title}
              </h2>
              {questions[page - 1].questions.map(renderQuestion)}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {page > 0 && (
            <Button type="button" onClick={handleBack} variant="outline">
              Back
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Submitting..."
              : page < questions.length
              ? "Next"
              : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
