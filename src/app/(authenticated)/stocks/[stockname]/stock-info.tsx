'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  DollarSign, 
  TrendingUp,
  UserCircle2
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Hero Section */}

      {/* Key Metrics Section */}
      <section className="py-16 container mx-auto px-2">
        <h2 className="text-3xl font-bold mb-8">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Market Cap", value: "₹17.62T", subtitle: "INR", icon: DollarSign, color: "blue" },
            { title: "Revenue", value: "₹9.25T", subtitle: "Annual Revenue", icon: TrendingUp, color: "green" },
            { title: "Stock Price", value: "₹1,302.15", subtitle: "Current Price", icon: BarChart, color: "purple" },
            { title: "Dividend Yield", value: "0.38%", subtitle: "Annual Yield", icon: DollarSign, color: "yellow" }
          ].map((metric, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className={`w-4 h-4 text-${metric.color}-600 group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {metric.value}
                </div>
                <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 container mx-auto px-2">
        <h2 className="text-3xl font-bold mb-8">Key Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Mr. Mukesh Dhirubhai Ambani", role: "Chairman & MD", age: 66 },
            { name: "Mr. Nikhil Rasiklal Meswani", role: "Executive Director", age: 57 },
            { name: "Mr. Srikanth Venkatachari", role: "Chief Financial Officer", age: 57 }
          ].map((leader, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {leader.name}
                  </CardTitle>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-2 rounded-full group-hover:scale-110 transition-transform">
                  <UserCircle2 className="w-8 h-8 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-medium">{leader.role}</p>
                <p className="mt-2 text-sm">Age: {leader.age}</p>
                <div className="mt-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-sm">
                    <span className="font-medium">Experience:</span> 30+ years
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Education:</span> MBA
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;


