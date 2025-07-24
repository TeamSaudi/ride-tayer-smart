import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReportMissingTransportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { transportType: string; location: string; description: string }) => void;
}

const ReportMissingTransportDialog: React.FC<ReportMissingTransportDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [transportType, setTransportType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const isFormValid = transportType.trim() !== "" && location.trim() !== "" && description.trim() !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit({ transportType, location, description });
    setTransportType("");
    setLocation("");
    setDescription("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Report Missing Transport</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="transportType">Transport Type</Label>
            <Input
              id="transportType"
              placeholder="e.g. Bus, Metro, Taxi"
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Location or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={!isFormValid} onClick={handleSubmit}>Report</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReportMissingTransportDialog;