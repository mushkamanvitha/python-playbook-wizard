import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Plus, BarChart3, CheckCircle, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
}

const categories = ["Food", "Transportation", "Entertainment", "Education", "Healthcare", "Shopping", "Other"];

export default function StudentFinanceManager() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [monthlyBudget] = useState(5000);
  const { toast } = useToast();

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const isWithinBudget = totalSpent <= monthlyBudget;

  const addExpense = () => {
    if (!expenseName || !expenseAmount || !expenseCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      name: expenseName,
      amount: amount,
      category: expenseCategory,
      date: new Date(),
    };

    setExpenses([...expenses, newExpense]);
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("");

    toast({
      title: "Expense Added",
      description: `${expenseName} - ₹${amount} added successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Leaf className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Student Finance Manager</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Add Expense Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Plus className="h-5 w-5" />
              Add Expense
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Expense Name (e.g., Lunch)"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
            <Input
              placeholder="Amount (₹)"
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />
            <Select value={expenseCategory} onValueChange={setExpenseCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addExpense} className="bg-primary hover:bg-primary/90">
              Add
            </Button>
          </CardContent>
        </Card>

        {/* Expense Tracker Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <BarChart3 className="h-5 w-5" />
              Expense Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-3 bg-muted p-4 font-medium">
                <div>Name</div>
                <div>Amount (₹)</div>
                <div>Category</div>
              </div>
              {expenses.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No expenses recorded
                </div>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="grid grid-cols-3 p-4 border-t">
                    <div>{expense.name}</div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {expense.amount}
                    </div>
                    <div>{expense.category}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget & Analytics Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <BarChart3 className="h-5 w-5" />
              Budget & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Monthly Budget</div>
                <div className="text-lg font-semibold flex items-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {monthlyBudget.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-lg font-semibold flex items-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {totalSpent.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              isWithinBudget ? 'bg-success/20 text-success-foreground' : 'bg-destructive/20 text-destructive-foreground'
            }`}>
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {isWithinBudget 
                  ? "You are within budget" 
                  : `You are ₹${(totalSpent - monthlyBudget).toLocaleString()} over budget`
                }
              </span>
            </div>

            {/* Budget Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Budget Usage</span>
                <span>{Math.min(100, Math.round((totalSpent / monthlyBudget) * 100))}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isWithinBudget ? 'bg-primary' : 'bg-destructive'
                  }`}
                  style={{ width: `${Math.min(100, (totalSpent / monthlyBudget) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}