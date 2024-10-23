"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StudentData {
  name: string;
  department: string;
  classNumber: number;
  yearOfPassing: string;
  printRating: number;
  printDelays: string;
  printImprovements: string;
  slipRating: number;
  slipDelays: string;
  slipImprovements: string;
  canteenRating: number;
  canteenDelays: string;
  canteenImprovements: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<{
    totalResponses: number;
    serviceRatings: { name: string; rating: number }[];
    studentData: StudentData[];
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      fetchData(token);
    }
  }, []);

  const fetchData = async (token: string) => {
    const response = await fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const result = await response.json();
      setData(result);
    } else {
      router.push("/admin/login");
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="studentData">Student Data</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{data.totalResponses}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Service Ratings</CardTitle>
              <CardDescription>
                Average ratings for each service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.serviceRatings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="studentData">
          <Card>
            <CardHeader>
              <CardTitle>Student Responses</CardTitle>
              <CardDescription>
                Detailed view of all student survey responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Year of Passing</TableHead>
                    <TableHead>Print Rating</TableHead>
                    <TableHead>Print Delays</TableHead>
                    <TableHead>Slip Rating</TableHead>
                    <TableHead>Slip Delays</TableHead>
                    <TableHead>Canteen Rating</TableHead>
                    <TableHead>Canteen Delays</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.studentData.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.classNumber}</TableCell>
                      <TableCell>{student.yearOfPassing}</TableCell>
                      <TableCell>{student.printRating}</TableCell>
                      <TableCell>{student.printDelays}</TableCell>
                      <TableCell>{student.slipRating}</TableCell>
                      <TableCell>{student.slipDelays}</TableCell>
                      <TableCell>{student.canteenRating}</TableCell>
                      <TableCell>{student.canteenDelays}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}