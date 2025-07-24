import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";

interface Review {
  id: string;
  userName: string;
  userInitials: string;
  transportType: string;
  route: string;
  rating: number;
  date: string;
  comfort: number;
  driving: number;
  vehicle: number;
  comment: string;
  likes: number;
  area: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    userName: "أحمد محمد",
    userInitials: "AM",
    transportType: "Bus",
    route: "Cairo Transport #142",
    rating: 4,
    date: "2 days ago",
    comfort: 4,
    driving: 5,
    vehicle: 3,
    comment: "الباص نظيف والسواق محترم جداً. الرحلة كانت مريحة ووصلت في الوقت المحدد. أنصح بهذا الخط للي بيروح وسط البلد.",
    likes: 12,
    area: "Downtown Cairo"
  },
  {
    id: "2",
    userName: "فاطمة علي",
    userInitials: "FA",
    transportType: "Metro",
    route: "Line 1 - Sadat Station",
    rating: 5,
    date: "1 week ago",
    comfort: 5,
    driving: 5,
    vehicle: 4,
    comment: "المترو سريع جداً ونظيف. التكييف شغال كويس والمحطات واضحة. احسن وسيلة مواصلات في القاهرة.",
    likes: 24,
    area: "Central Cairo"
  },
  {
    id: "3",
    userName: "محمد حسن",
    userInitials: "MH",
    transportType: "Microbus",
    route: "Ramsis - Tahrir",
    rating: 3,
    date: "3 days ago",
    comfort: 2,
    driving: 3,
    vehicle: 3,
    comment: "المايكروباص مزدحم شوية بس السعر كويس والسواق يعرف الطريق كويس. ممكن يكون أحسن لو كان أقل زحمة.",
    likes: 8,
    area: "Ramsis"
  }
];

const Reviews = () => {
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(0);

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? "text-warning fill-current" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderClickableStars = (rating: number, onRate: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className="p-1"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= rating ? "text-warning fill-current" : "text-muted-foreground hover:text-warning"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const filteredReviews = mockReviews.filter(review => {
    const areaMatch = selectedArea === "all" || review.area.toLowerCase().includes(selectedArea.toLowerCase());
    const typeMatch = selectedType === "all" || review.transportType.toLowerCase() === selectedType.toLowerCase();
    return areaMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Community <span className="bg-gradient-secondary bg-clip-text text-transparent">Reviews</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Read real experiences and share your transportation reviews to help others
          </p>
        </div>

        {/* Filters and Add Review */}
        <Card className="mb-8 shadow-elegant">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    <SelectItem value="downtown">Downtown Cairo</SelectItem>
                    <SelectItem value="central">Central Cairo</SelectItem>
                    <SelectItem value="giza">Giza</SelectItem>
                    <SelectItem value="alexandria">Alexandria</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Transport Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="taxi">Taxi</SelectItem>
                    <SelectItem value="microbus">Microbus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="hero" 
                onClick={() => setShowAddReview(!showAddReview)}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Review Form */}
        {showAddReview && (
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <CardDescription>Help the community by reviewing your recent transportation experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Overall Rating</Label>
                  {renderClickableStars(newRating, setNewRating)}
                </div>
                <div>
                  <Label>Transport Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="metro">Metro</SelectItem>
                      <SelectItem value="taxi">Taxi</SelectItem>
                      <SelectItem value="microbus">Microbus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Your Review</Label>
                <Textarea placeholder="Share your experience with this transportation option..." />
              </div>
              
              <div className="flex gap-2">
                <Button variant="hero">Submit Review</Button>
                <Button variant="outline" onClick={() => setShowAddReview(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {review.userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{review.userName}</h3>
                      <p className="text-sm text-muted-foreground">{review.date} • {review.area}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{review.transportType}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{review.route}</h4>
                    {renderStars(review.rating, "md")}
                  </div>
                </div>
                
                {/* Rating Breakdown */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Comfort</p>
                    {renderStars(review.comfort)}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Driving</p>
                    {renderStars(review.driving)}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    {renderStars(review.vehicle)}
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed">{review.comment}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {review.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Helpful review?</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Footer */}
        <div className="text-center py-16">
          <Card className="inline-block bg-gradient-secondary text-white shadow-secondary">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
              <p className="mb-4 opacity-90">Share your experiences and help make transportation better for everyone</p>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-secondary">
                Start Reviewing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reviews;