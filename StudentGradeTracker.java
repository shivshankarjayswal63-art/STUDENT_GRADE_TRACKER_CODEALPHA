import java.util.ArrayList;
import java.util.Scanner;

/**
 * StudentGradeTracker - A console-based application to manage student grades
 * This program allows users to add students, view grades, and perform various grade calculations
 */
public class StudentGradeTracker {
    private ArrayList<Student> students;
    private Scanner scanner;
    
    /**
     * Constructor to initialize the StudentGradeTracker
     */
    public StudentGradeTracker() {
        students = new ArrayList<>();
        scanner = new Scanner(System.in);
    }
    
    /**
     * Main method to run the StudentGradeTracker application
     * @param args Command line arguments (not used)
     */
    public static void main(String[] args) {
        StudentGradeTracker tracker = new StudentGradeTracker();
        tracker.run();
    }
    
    /**
     * Main program loop that displays the menu and handles user input
     */
    public void run() {
        int choice;
        
        System.out.println("=== Welcome to Student Grade Tracker ===");
        
        do {
            displayMenu();
            choice = getValidChoice();
            
            switch (choice) {
                case 1:
                    addStudent();
                    break;
                case 2:
                    displayAllStudents();
                    break;
                case 3:
                    showAverageGrade();
                    break;
                case 4:
                    showHighestGrade();
                    break;
                case 5:
                    showLowestGrade();
                    break;
                case 6:
                    showGradeStatistics();
                    break;
                case 7:
                    System.out.println("Thank you for using Student Grade Tracker!");
                    break;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
            
            if (choice != 7) {
                System.out.println("\nPress Enter to continue...");
                scanner.nextLine(); // Wait for user to press Enter
            }
            
        } while (choice != 7);
        
        scanner.close();
    }
    
    /**
     * Display the main menu options
     */
    private void displayMenu() {
        System.out.println("\n=== Student Grade Tracker Menu ===");
        System.out.println("1. Add Student");
        System.out.println("2. Display All Students");
        System.out.println("3. Show Average Grade");
        System.out.println("4. Show Highest Grade");
        System.out.println("5. Show Lowest Grade");
        System.out.println("6. Show Grade Statistics");
        System.out.println("7. Exit");
        System.out.println("----------------------------------------");
    }
    
    /**
     * Get and validate user menu choice
     * @return Valid integer choice from 1-7
     */
    private int getValidChoice() {
        while (true) {
            try {
                System.out.print("Enter your choice (1-7): ");
                String input = scanner.nextLine().trim();
                
                if (input.isEmpty()) {
                    System.out.println("Input is invalid");
                    continue;
                }
                
                int choice = Integer.parseInt(input);
                if (choice >= 1 && choice <= 7) {
                    return choice;
                } else {
                    System.out.println("Input is invalid");
                }
            } catch (NumberFormatException e) {
                System.out.println("Input is invalid");
            } catch (Exception e) {
                System.out.println("Input is invalid");
            }
        }
    }
    
    /**
     * Add a new student with grade to the system
     */
    private void addStudent() {
        System.out.println("\n=== Add New Student ===");
        
        try {
            // Get student name
            System.out.print("Enter student name: ");
            String name = scanner.nextLine().trim();
            
            // Validate name is not empty
            if (name.isEmpty()) {
                System.out.println("Error: Student name cannot be empty.");
                return;
            }
            
            // Get student grade
            System.out.print("Enter student grade (0.0 - 100.0): ");
            String gradeInput = scanner.nextLine().trim();
            
            try {
                double grade = Double.parseDouble(gradeInput);
                
                // Validate grade range
                if (grade < 0.0 || grade > 100.0) {
                    System.out.println("Error: Grade must be between 0.0 and 100.0.");
                    return;
                }
                
                // Create and add student
                Student newStudent = new Student(name, grade);
                students.add(newStudent);
                System.out.println("Student '" + name + "' with grade " + grade + " added successfully!");
                
            } catch (NumberFormatException e) {
                System.out.println("Error: Invalid grade format. Please enter a valid number.");
            }
            
        } catch (Exception e) {
            System.out.println("Error: An unexpected error occurred. Please try again.");
        }
    }
    
    /**
     * Display all students and their grades
     */
    private void displayAllStudents() {
        System.out.println("\n=== All Students ===");
        
        if (students.isEmpty()) {
            System.out.println("No students found. Please add some students first.");
            return;
        }
        
        System.out.println("Total students: " + students.size());
        System.out.println("----------------------------------------");
        
        for (int i = 0; i < students.size(); i++) {
            Student student = students.get(i);
            System.out.println((i + 1) + ". " + student.toString());
        }
    }
    
    /**
     * Calculate and display the average grade of all students
     */
    private void showAverageGrade() {
        System.out.println("\n=== Average Grade ===");
        
        if (students.isEmpty()) {
            System.out.println("No students found. Cannot calculate average.");
            return;
        }
        
        double totalGrade = 0.0;
        for (Student student : students) {
            totalGrade += student.getGrade();
        }
        
        double average = totalGrade / students.size();
        System.out.printf("Average grade: %.2f\n", average);
        System.out.println("Total students: " + students.size());
    }
    
    /**
     * Find and display the student with the highest grade
     */
    private void showHighestGrade() {
        System.out.println("\n=== Highest Grade ===");
        
        if (students.isEmpty()) {
            System.out.println("No students found. Cannot find highest grade.");
            return;
        }
        
        Student highestStudent = students.get(0);
        double highestGrade = highestStudent.getGrade();
        
        for (Student student : students) {
            if (student.getGrade() > highestGrade) {
                highestGrade = student.getGrade();
                highestStudent = student;
            }
        }
        
        System.out.println("Highest grade: " + highestGrade);
        System.out.println("Student: " + highestStudent.getName());
    }
    
    /**
     * Find and display the student with the lowest grade
     */
    private void showLowestGrade() {
        System.out.println("\n=== Lowest Grade ===");
        
        if (students.isEmpty()) {
            System.out.println("No students found. Cannot find lowest grade.");
            return;
        }
        
        Student lowestStudent = students.get(0);
        double lowestGrade = lowestStudent.getGrade();
        
        for (Student student : students) {
            if (student.getGrade() < lowestGrade) {
                lowestGrade = student.getGrade();
                lowestStudent = student;
            }
        }
        
        System.out.println("Lowest grade: " + lowestGrade);
        System.out.println("Student: " + lowestStudent.getName());
    }
    
    /**
     * Display comprehensive grade statistics for all students
     */
    private void showGradeStatistics() {
        System.out.println("\n=== Grade Statistics ===");
        
        if (students.isEmpty()) {
            System.out.println("No students found. Cannot show statistics.");
            return;
        }
        
        System.out.println("Total students: " + students.size());
        System.out.println("----------------------------------------");
        
        // Calculate statistics
        double totalGrade = 0.0;
        double highestGrade = students.get(0).getGrade();
        double lowestGrade = students.get(0).getGrade();
        String highestStudent = students.get(0).getName();
        String lowestStudent = students.get(0).getName();
        
        for (Student student : students) {
            double grade = student.getGrade();
            totalGrade += grade;
            
            if (grade > highestGrade) {
                highestGrade = grade;
                highestStudent = student.getName();
            }
            
            if (grade < lowestGrade) {
                lowestGrade = grade;
                lowestStudent = student.getName();
            }
        }
        
        double average = totalGrade / students.size();
        
        // Display all statistics
        System.out.printf("Average Grade: %.2f\n", average);
        System.out.println("Highest Grade: " + highestGrade + " (Student: " + highestStudent + ")");
        System.out.println("Lowest Grade: " + lowestGrade + " (Student: " + lowestStudent + ")");
        System.out.println("Grade Range: " + (highestGrade - lowestGrade));
    }
}
