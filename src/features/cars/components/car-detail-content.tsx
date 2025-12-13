"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  Wrench,
  FileText,
  Banknote,
  Calendar,
  Plus,
  Upload,
  CheckCircle,
  Clock,
  Save,
  BrainCircuit,
  Pencil,
  Trash2,
  Eye,
  Hammer,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateCar } from "../actions/car-actions";
import {
  createProblem,
  deleteProblem,
  reanalyzeProblem,
  toggleProblemStatus,
  updateProblem,
} from "../actions/problem-actions";
import { createExpense, deleteExpense } from "../actions/expense-actions";
import { createDocument, deleteDocument } from "../actions/document-actions";
import {
  CarWithRelations,
  Problem,
  ProblemSeverity,
  ProblemStatus,
  ProblemStatusLabels,
  SeveritySource,
  ExpenseType,
  ExpenseTypeLabels,
} from "../types";

interface CarDetailContentProps {
  car: CarWithRelations;
}

export function CarDetailContent({ car }: CarDetailContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reanalyzingProblemId, setReanalyzingProblemId] = useState<string | null>(
    null
  );

  const [problemStatusFilter, setProblemStatusFilter] = useState<
    ProblemStatus | "ALL"
  >("ALL");

  const [isEditingProblem, setIsEditingProblem] = useState(false);
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [editingProblemOriginalSeverity, setEditingProblemOriginalSeverity] =
    useState<ProblemSeverity | null>(null);
  const [editingProblemAiSeverity, setEditingProblemAiSeverity] = useState<
    ProblemSeverity | null
  >(null);
  const [editingProblemSeveritySource, setEditingProblemSeveritySource] =
    useState<SeveritySource | null>(null);
  const [problemEditForm, setProblemEditForm] = useState<{
    title: string;
    description: string;
    status: ProblemStatus;
    severity: ProblemSeverity;
  }>({
    title: "",
    description: "",
    status: ProblemStatus.OPEN,
    severity: ProblemSeverity.MEDIUM,
  });

  const [editForm, setEditForm] = useState({
    make: car.make,
    model: car.model,
    year: car.year,
    vin: car.vin || "",
    currentMileage: car.currentMileage,
    nextInspectionDate: car.nextInspectionDate.toISOString().split("T")[0],
    nextServiceDate: car.nextServiceDate
      ? car.nextServiceDate.toISOString().split("T")[0]
      : "",
    purchasePrice: car.purchasePrice / 100,
  });

  const [newProblemTitle, setNewProblemTitle] = useState("");
  const [newProblemDesc, setNewProblemDesc] = useState("");

  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);
  const [newExpenseType, setNewExpenseType] = useState<ExpenseType>(
    ExpenseType.MAINTENANCE
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveCarDetails = () => {
    startTransition(async () => {
      await updateCar(car.id, {
        make: editForm.make,
        model: editForm.model,
        year: editForm.year,
        vin: editForm.vin || undefined,
        currentMileage: editForm.currentMileage,
        nextInspectionDate: new Date(editForm.nextInspectionDate),
        nextServiceDate: editForm.nextServiceDate
          ? new Date(editForm.nextServiceDate)
          : null,
        purchasePrice: Math.round(editForm.purchasePrice * 100),
      });
      setIsEditingCar(false);
      router.refresh();
    });
  };

  const handleAddProblem = async () => {
    if (!newProblemTitle) return;

    setIsAnalyzing(true);
    startTransition(async () => {
      await createProblem(car.id, {
        title: newProblemTitle,
        description: newProblemDesc,
      });
      setNewProblemTitle("");
      setNewProblemDesc("");
      setIsAnalyzing(false);
      setShowAddProblem(false);
      router.refresh();
    });
  };

  const handleToggleProblemStatus = (problemId: string) => {
    startTransition(async () => {
      await toggleProblemStatus(problemId);
      router.refresh();
    });
  };

  const handleReanalyzeProblem = (problemId: string) => {
    setReanalyzingProblemId(problemId);
    startTransition(async () => {
      try {
        await reanalyzeProblem(problemId);
      } finally {
        setReanalyzingProblemId(null);
        router.refresh();
      }
    });
  };

  const openEditProblem = (problem: Problem) => {
    setEditingProblemId(problem.id);
    setEditingProblemOriginalSeverity(problem.severity);
    setEditingProblemAiSeverity(problem.aiSeverity);
    setEditingProblemSeveritySource(problem.severitySource);
    setProblemEditForm({
      title: problem.title,
      description: problem.description,
      status: problem.status,
      severity: problem.severity,
    });
    setIsEditingProblem(true);
  };

  const handleSaveProblemEdits = () => {
    if (!editingProblemId) return;

    const severityToSave =
      editingProblemOriginalSeverity &&
      problemEditForm.severity !== editingProblemOriginalSeverity
        ? problemEditForm.severity
        : undefined;

    startTransition(async () => {
      await updateProblem(editingProblemId, {
        title: problemEditForm.title,
        description: problemEditForm.description,
        status: problemEditForm.status,
        ...(severityToSave ? { severity: severityToSave } : {}),
      });
      setIsEditingProblem(false);
      setEditingProblemId(null);
      setEditingProblemOriginalSeverity(null);
      setEditingProblemAiSeverity(null);
      setEditingProblemSeveritySource(null);
      router.refresh();
    });
  };

  const handleDeleteProblem = (problemId: string) => {
    const confirmed = window.confirm(
      "Willst du dieses Ticket wirklich löschen?"
    );
    if (!confirmed) return;

    startTransition(async () => {
      await deleteProblem(problemId);
      router.refresh();
    });
  };

  const handleAddExpense = () => {
    if (newExpenseAmount <= 0) return;

    startTransition(async () => {
      await createExpense(car.id, {
        description: newExpenseDesc || ExpenseTypeLabels[newExpenseType],
        amount: newExpenseAmount,
        type: newExpenseType,
      });
      setNewExpenseAmount(0);
      setNewExpenseDesc("");
      setShowAddExpense(false);
      router.refresh();
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    startTransition(async () => {
      await deleteExpense(expenseId);
      router.refresh();
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        startTransition(async () => {
          await createDocument(car.id, {
            name: file.name,
            fileType: file.type,
            content: reader.result as string,
          });
          router.refresh();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    startTransition(async () => {
      await deleteDocument(documentId);
      router.refresh();
    });
  };

  const openDocument = (doc: { content: string; name: string }) => {
    if (doc.content) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${doc.content}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    }
  };

  const getExpenseIcon = (type: ExpenseType) => {
    switch (type) {
      case ExpenseType.MAINTENANCE:
        return <Wrench className="h-4 w-4 text-blue-500" />;
      case ExpenseType.REPAIR:
        return <Hammer className="h-4 w-4 text-orange-500" />;
      case ExpenseType.TUNING:
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case ExpenseType.PURCHASE:
        return <Banknote className="h-4 w-4 text-green-500" />;
      default:
        return <Banknote className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const daysToInspection = Math.ceil(
    (new Date(car.nextInspectionDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const inspectionUrgency =
    daysToInspection < 0 ? "critical" : daysToInspection < 30 ? "warning" : "ok";

  let serviceUrgency = "none";
  if (car.nextServiceDate) {
    const daysToService = Math.ceil(
      (new Date(car.nextServiceDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    serviceUrgency =
      daysToService < 0 ? "critical" : daysToService < 30 ? "warning" : "ok";
  }

  const totalInvested =
    car.purchasePrice + car.expenses.reduce((s, e) => s + e.amount, 0);

  const filteredProblems = car.problems.filter((p) =>
    problemStatusFilter === "ALL" ? true : p.status === problemStatusFilter
  );

  return (
    <div className="flex flex-col px-32">
      <Dialog open={isEditingCar} onOpenChange={setIsEditingCar}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Fahrzeugdaten bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Marke</Label>
              <Input
                value={editForm.make}
                onChange={(e) =>
                  setEditForm({ ...editForm, make: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Modell</Label>
              <Input
                value={editForm.model}
                onChange={(e) =>
                  setEditForm({ ...editForm, model: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Baujahr</Label>
              <Input
                type="number"
                value={editForm.year}
                onChange={(e) =>
                  setEditForm({ ...editForm, year: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Kilometerstand</Label>
              <Input
                type="number"
                value={editForm.currentMileage}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    currentMileage: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="col-span-2">
              <Label>Nächstes Pickerl/TÜV</Label>
              <Input
                type="date"
                value={editForm.nextInspectionDate}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    nextInspectionDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-2">
              <Label>Nächster Service (Öl/Inspektion)</Label>
              <Input
                type="date"
                value={editForm.nextServiceDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, nextServiceDate: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <Label>VIN (Fahrgestellnummer)</Label>
              <Input
                value={editForm.vin}
                onChange={(e) =>
                  setEditForm({ ...editForm, vin: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <Label>Kaufpreis (€)</Label>
              <Input
                type="number"
                value={editForm.purchasePrice}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    purchasePrice: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsEditingCar(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveCarDetails} disabled={isPending}>
              Speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditingProblem}
        onOpenChange={(open) => {
          setIsEditingProblem(open);
          if (!open) {
            setEditingProblemId(null);
            setEditingProblemOriginalSeverity(null);
            setEditingProblemAiSeverity(null);
            setEditingProblemSeveritySource(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ticket bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titel</Label>
              <Input
                value={problemEditForm.title}
                onChange={(e) =>
                  setProblemEditForm({
                    ...problemEditForm,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Beschreibung</Label>
              <Textarea
                value={problemEditForm.description}
                onChange={(e) =>
                  setProblemEditForm({
                    ...problemEditForm,
                    description: e.target.value,
                  })
                }
                rows={4}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={problemEditForm.status}
                onValueChange={(v) =>
                  setProblemEditForm({
                    ...problemEditForm,
                    status: v as ProblemStatus,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProblemStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {ProblemStatusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Schweregrad</Label>
              <Select
                value={problemEditForm.severity}
                onValueChange={(v) =>
                  setProblemEditForm({
                    ...problemEditForm,
                    severity: v as ProblemSeverity,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProblemSeverity).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {editingProblemSeveritySource && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {editingProblemSeveritySource === SeveritySource.AI
                    ? "Schweregrad wurde von der KI bestimmt."
                    : "Schweregrad wurde manuell gesetzt."}
                  {editingProblemSeveritySource === SeveritySource.USER &&
                    editingProblemAiSeverity &&
                    ` (KI-Vorschlag: ${editingProblemAiSeverity})`}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsEditingProblem(false)}
            >
              Abbrechen
            </Button>
            <Button onClick={handleSaveProblemEdits} disabled={isPending}>
              Speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="border-b pb-6 mb-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/cars")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {car.make} {car.model}
              <button
                onClick={() => setIsEditingCar(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs border rounded px-2 py-0.5">
                <Calendar className="h-3 w-3" /> {car.year}
              </span>
              <span className="inline-flex items-center gap-1 text-xs border rounded px-2 py-0.5">
                <Clock className="h-3 w-3" /> {car.currentMileage.toLocaleString()}{" "}
                km
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs border rounded px-2 py-0.5 font-bold ${
                  inspectionUrgency === "critical"
                    ? "bg-destructive/10 border-destructive text-destructive"
                    : inspectionUrgency === "warning"
                    ? "bg-orange-500/10 border-orange-500 text-orange-500"
                    : "text-green-500"
                }`}
              >
                {inspectionUrgency === "critical" && (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {inspectionUrgency === "warning" && (
                  <AlertCircle className="h-3 w-3" />
                )}
                {inspectionUrgency === "ok" && <CheckCircle className="h-3 w-3" />}
                TÜV: {new Date(car.nextInspectionDate).toLocaleDateString("de-DE")}
              </span>
              {car.nextServiceDate && (
                <span
                  className={`inline-flex items-center gap-1 text-xs border rounded px-2 py-0.5 font-bold ${
                    serviceUrgency === "critical"
                      ? "bg-destructive/10 border-destructive text-destructive"
                      : serviceUrgency === "warning"
                      ? "bg-orange-500/10 border-orange-500 text-orange-500"
                      : "text-purple-500"
                  }`}
                >
                  <Wrench className="h-3 w-3" />
                  Service:{" "}
                  {new Date(car.nextServiceDate).toLocaleDateString("de-DE")}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-muted-foreground uppercase">
            Investiert (Gesamt)
          </p>
          <p className="text-xl font-mono font-bold">
            {(totalInvested / 100).toLocaleString()}€
          </p>
        </div>
      </div>

      <Tabs defaultValue="problems" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="problems">Probleme & Tickets</TabsTrigger>
          <TabsTrigger value="expenses">Service & Kosten</TabsTrigger>
          <TabsTrigger value="documents">Dokumente</TabsTrigger>
        </TabsList>

        <TabsContent value="problems" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Aktuelle Tickets</h3>
            <div className="flex items-center gap-3">
              <Select
                value={problemStatusFilter}
                onValueChange={(v) =>
                  setProblemStatusFilter(v as ProblemStatus | "ALL")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Alle Status</SelectItem>
                  {Object.values(ProblemStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {ProblemStatusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={() => setShowAddProblem(true)}>
                <Plus className="mr-2 h-4 w-4" /> Neues Problem
              </Button>
            </div>
          </div>

          {showAddProblem && (
            <Card className="animate-in fade-in slide-in-from-top-4">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4">Neues Ticket erstellen</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Titel</Label>
                    <Input
                      value={newProblemTitle}
                      onChange={(e) => setNewProblemTitle(e.target.value)}
                      placeholder="z.B. Komisches Geräusch beim Bremsen"
                    />
                  </div>
                  <div>
                    <Label>Beschreibung (für KI-Analyse)</Label>
                    <Textarea
                      value={newProblemDesc}
                      onChange={(e) => setNewProblemDesc(e.target.value)}
                      placeholder="Beschreibe das Problem genau..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setShowAddProblem(false)}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      disabled={isAnalyzing || isPending}
                      onClick={handleAddProblem}
                    >
                      {isAnalyzing ? (
                        <BrainCircuit className="mr-2 h-4 w-4 animate-pulse" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {isAnalyzing ? "Analysiere..." : "Speichern"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {car.problems.length === 0 && (
              <p className="text-muted-foreground text-center py-12">
                Keine Probleme gemeldet. Gute Fahrt!
              </p>
            )}

            {car.problems.length > 0 && filteredProblems.length === 0 && (
              <p className="text-muted-foreground text-center py-12">
                Keine Tickets für diesen Status.
              </p>
            )}

            {filteredProblems.map((problem) => (
              <Card key={problem.id}>
                <CardContent className="p-5 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          problem.status === ProblemStatus.RESOLVED
                            ? "bg-green-500"
                            : problem.status === ProblemStatus.IN_PROGRESS
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      <h4 className="font-bold">{problem.title}</h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${
                          problem.severity === "CRITICAL"
                            ? "border-destructive text-destructive"
                            : problem.severity === "HIGH"
                            ? "border-orange-500 text-orange-500"
                            : "border-muted text-muted-foreground"
                        }`}
                      >
                        {problem.severity}
                      </span>

                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {problem.severitySource === SeveritySource.AI
                          ? "KI"
                          : "MANUELL"}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {problem.description}
                    </p>

                    {problem.aiAnalysis && (
                      <div className="bg-muted/50 border rounded p-3 mt-3">
                        <div className="flex items-center gap-2 text-purple-500 text-xs font-bold uppercase mb-1">
                          <BrainCircuit className="h-3 w-3" /> KI-Analyse
                        </div>
                        <p className="text-xs leading-relaxed">
                          {problem.aiAnalysis}
                        </p>
                        {problem.aiSeverity && (
                          <p className="mt-2 text-xs font-mono text-muted-foreground">
                            KI-Schweregrad: {problem.aiSeverity}
                          </p>
                        )}
                        {problem.estimatedCost && problem.estimatedCost > 0 && (
                          <p className="mt-2 text-xs font-mono text-muted-foreground">
                            Geschätzte Kosten: ~€{problem.estimatedCost}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col justify-between items-end min-w-[140px] gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                    <div className="text-xs text-muted-foreground text-right">
                      {new Date(problem.createdAt).toLocaleDateString("de-DE")}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReanalyzeProblem(problem.id)}
                        className="text-muted-foreground hover:text-purple-500 transition-colors"
                        disabled={
                          isPending || reanalyzingProblemId === problem.id
                        }
                        title="KI-Analyse neu starten"
                      >
                        <BrainCircuit
                          className={`h-4 w-4 ${
                            reanalyzingProblemId === problem.id
                              ? "animate-pulse"
                              : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => openEditProblem(problem)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isPending}
                        title="Bearbeiten"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(problem.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        disabled={isPending}
                        title="Löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      variant={
                        problem.status === ProblemStatus.RESOLVED
                          ? "outline"
                          : "secondary"
                      }
                      size="sm"
                      onClick={() => handleToggleProblemStatus(problem.id)}
                      disabled={isPending}
                      className={
                        problem.status === ProblemStatus.RESOLVED
                          ? "border-green-500 text-green-500"
                          : ""
                      }
                    >
                      {problem.status === ProblemStatus.RESOLVED && (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {problem.status === ProblemStatus.IN_PROGRESS && (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {problem.status === ProblemStatus.OPEN && (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {ProblemStatusLabels[problem.status]}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Wartungs-Logbuch & Kosten</h3>
              <p className="text-sm text-muted-foreground">
                Führe Buch über alle Reparaturen und Upgrades.
              </p>
            </div>
            <Button onClick={() => setShowAddExpense(true)}>
              <Plus className="mr-2 h-4 w-4" /> Neuer Eintrag
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Kaufpreis
                </p>
                <p className="font-mono font-bold">
                  €{(car.purchasePrice / 100).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Wartung/Reparatur
                </p>
                <p className="font-mono font-bold">
                  €
                  {(
                    car.expenses
                      .filter(
                        (e) =>
                          e.type === ExpenseType.MAINTENANCE ||
                          e.type === ExpenseType.REPAIR
                      )
                      .reduce((s, e) => s + e.amount, 0) / 100
                  ).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase mb-1">
                  Tuning/Upgrades
                </p>
                <p className="font-mono font-bold">
                  €
                  {(
                    car.expenses
                      .filter((e) => e.type === ExpenseType.TUNING)
                      .reduce((s, e) => s + e.amount, 0) / 100
                  ).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <p className="text-xs uppercase mb-1">Gesamtinvestition</p>
                <p className="font-mono font-bold">
                  €{(totalInvested / 100).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {showAddExpense && (
            <Card>
              <CardContent className="p-6">
                <h4 className="font-bold mb-4">Neuer Logbuch-Eintrag</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Betrag (€)</Label>
                    <Input
                      type="number"
                      value={newExpenseAmount}
                      onChange={(e) =>
                        setNewExpenseAmount(parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label>Kategorie</Label>
                    <Select
                      value={newExpenseType}
                      onValueChange={(v) => setNewExpenseType(v as ExpenseType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ExpenseType).map((t) => (
                          <SelectItem key={t} value={t}>
                            {ExpenseTypeLabels[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Beschreibung / Durchgeführte Arbeiten</Label>
                    <Input
                      value={newExpenseDesc}
                      onChange={(e) => setNewExpenseDesc(e.target.value)}
                      placeholder="z.B. Ölwechsel 5W-30, Ölfilter, Luftfilter getauscht"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddExpense(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button onClick={handleAddExpense} disabled={isPending}>
                    Hinzufügen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                      Typ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                      Datum
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                      Beschreibung
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase">
                      Kosten
                    </th>
                    <th className="px-6 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {car.expenses.map((expense) => (
                    <tr key={expense.id} className="group hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center gap-2"
                          title={ExpenseTypeLabels[expense.type]}
                        >
                          {getExpenseIcon(expense.type)}
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            {ExpenseTypeLabels[expense.type]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(expense.date).toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        €{(expense.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {car.expenses.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-muted-foreground"
                      >
                        Noch keine Einträge vorhanden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Dokumente & Verträge</h3>
              <p className="text-sm text-muted-foreground">
                Speichere Kaufverträge, Rechnungen und Genehmigungen.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,.pdf"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {car.documents.map((doc) => {
              const isImage = doc.fileType.startsWith("image/");
              return (
                <Card
                  key={doc.id}
                  className="group cursor-pointer hover:border-primary/50 overflow-hidden"
                >
                  <div
                    className="aspect-[3/4] bg-muted relative overflow-hidden"
                    onClick={() => openDocument(doc)}
                  >
                    {isImage && doc.content ? (
                      <img
                        src={doc.content}
                        alt={doc.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <FileText className="h-12 w-12" strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Eye className="text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all h-8 w-8" />
                    </div>
                  </div>
                  <CardContent className="p-3 border-t relative">
                    <p className="text-sm font-bold truncate pr-6">{doc.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase mt-1">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                      className="absolute right-2 top-3 text-muted-foreground hover:text-destructive transition-colors"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
            {car.documents.length === 0 && (
              <div className="col-span-full border border-dashed rounded-lg p-12 text-center">
                <p className="text-muted-foreground">
                  Keine Dokumente hochgeladen (Kaufvertrag, Rechnungen,
                  Pickerl-Bericht).
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
