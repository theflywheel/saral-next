import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Welcome to Saral Toolkit Demo
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Explore the capabilities of Saral Toolkit through our interactive demos
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/core-demo">Core Demo</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/parser-demo">Parser UI Demo</Link>
          </Button>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Core Saral</CardTitle>
            <CardDescription>
              Core functionality for project management and data processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Core Saral library provides essential functionality for managing projects, 
              configuring data sources and sinks, and setting up data capture configurations.
            </p>
            <Button asChild variant="outline">
              <Link href="/core-demo">Explore Core Demo</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parser UI</CardTitle>
            <CardDescription>
              Document parsing and visualization tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Parser UI library offers components for uploading, parsing, and visualizing 
              documents. Extract structured data from various file formats including PDFs, images, 
              and Word documents.
            </p>
            <Button asChild variant="outline">
              <Link href="/parser-demo">Explore Parser UI Demo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}