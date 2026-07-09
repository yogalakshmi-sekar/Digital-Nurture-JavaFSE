-- ==========================================
-- Exercise 1 : Control Structures
-- ==========================================

-- Drop tables if they already exist
BEGIN
EXECUTE IMMEDIATE 'DROP TABLE Loans';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
EXECUTE IMMEDIATE 'DROP TABLE Customers';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

--------------------------------------------------
-- Create Customers Table
--------------------------------------------------

CREATE TABLE Customers (
                           CustomerID NUMBER PRIMARY KEY,
                           CustomerName VARCHAR2(50),
                           Age NUMBER,
                           Balance NUMBER,
                           IsVIP VARCHAR2(10)
);

--------------------------------------------------
-- Create Loans Table
--------------------------------------------------

CREATE TABLE Loans (
                       LoanID NUMBER PRIMARY KEY,
                       CustomerID NUMBER,
                       InterestRate NUMBER,
                       DueDate DATE
);

--------------------------------------------------
-- Insert Sample Customers
--------------------------------------------------

INSERT INTO Customers VALUES (101,'John',65,15000,'FALSE');
INSERT INTO Customers VALUES (102,'Alice',45,8000,'FALSE');
INSERT INTO Customers VALUES (103,'David',70,20000,'FALSE');
INSERT INTO Customers VALUES (104,'Emma',55,12000,'FALSE');
INSERT INTO Customers VALUES (105,'Robert',68,9000,'FALSE');

--------------------------------------------------
-- Insert Sample Loans
--------------------------------------------------

INSERT INTO Loans VALUES (1,101,10,SYSDATE+10);
INSERT INTO Loans VALUES (2,102,11,SYSDATE+40);
INSERT INTO Loans VALUES (3,103,9,SYSDATE+20);
INSERT INTO Loans VALUES (4,104,8,SYSDATE+5);
INSERT INTO Loans VALUES (5,105,12,SYSDATE+25);

COMMIT;

--------------------------------------------------
-- Scenario 1
-- Apply 1% Discount for Customers Above 60
--------------------------------------------------

BEGIN
FOR customer_record IN (
        SELECT CustomerID, Age
        FROM Customers
    )
    LOOP

        IF customer_record.Age > 60 THEN

UPDATE Loans
SET InterestRate = InterestRate - 1
WHERE CustomerID = customer_record.CustomerID;

DBMS_OUTPUT.PUT_LINE(
                'Discount applied for Customer ID: ' ||
                customer_record.CustomerID
            );

END IF;

END LOOP;

COMMIT;
END;
/

--------------------------------------------------
-- Scenario 2
-- Promote Customers to VIP
--------------------------------------------------

BEGIN

FOR customer_record IN (
        SELECT CustomerID, Balance
        FROM Customers
    )
    LOOP

        IF customer_record.Balance > 10000 THEN

UPDATE Customers
SET IsVIP = 'TRUE'
WHERE CustomerID = customer_record.CustomerID;

DBMS_OUTPUT.PUT_LINE(
                'Customer ID ' ||
                customer_record.CustomerID ||
                ' promoted to VIP.'
            );

END IF;

END LOOP;

COMMIT;

END;
/

--------------------------------------------------
-- Scenario 3
-- Loan Due Reminder
--------------------------------------------------

BEGIN

FOR loan_record IN (
        SELECT LoanID,
               CustomerID,
               DueDate
        FROM Loans
        WHERE DueDate BETWEEN SYSDATE AND SYSDATE + 30
    )
    LOOP

        DBMS_OUTPUT.PUT_LINE(
            'Reminder: Customer ID ' ||
            loan_record.CustomerID ||
            ' has Loan ID ' ||
            loan_record.LoanID ||
            ' due on ' ||
            TO_CHAR(loan_record.DueDate,'DD-MON-YYYY')
        );

END LOOP;

END;
/

--------------------------------------------------
-- Display Updated Customers Table
--------------------------------------------------

SELECT * FROM Customers;

--------------------------------------------------
-- Display Updated Loans Table
--------------------------------------------------

SELECT * FROM Loans;