-- ==========================================
-- Exercise 1 : Control Structures
-- Scenario:
-- Apply a 1% discount to loan interest rates
-- for customers above 60 years old.
-- ==========================================

SET SERVEROUTPUT ON;

----------------------------------------------------
-- CREATE TABLES
----------------------------------------------------

CREATE TABLE Customers (
                           CustomerID NUMBER PRIMARY KEY,
                           Name VARCHAR2(100),
                           DOB DATE,
                           Balance NUMBER,
                           LastModified DATE
);

CREATE TABLE Accounts (
                          AccountID NUMBER PRIMARY KEY,
                          CustomerID NUMBER,
                          AccountType VARCHAR2(20),
                          Balance NUMBER,
                          LastModified DATE,
                          FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE Transactions (
                              TransactionID NUMBER PRIMARY KEY,
                              AccountID NUMBER,
                              TransactionDate DATE,
                              Amount NUMBER,
                              TransactionType VARCHAR2(20),
                              FOREIGN KEY (AccountID) REFERENCES Accounts(AccountID)
);

CREATE TABLE Loans (
                       LoanID NUMBER PRIMARY KEY,
                       CustomerID NUMBER,
                       LoanAmount NUMBER,
                       InterestRate NUMBER,
                       StartDate DATE,
                       EndDate DATE,
                       FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE Employees (
                           EmployeeID NUMBER PRIMARY KEY,
                           Name VARCHAR2(100),
                           Position VARCHAR2(50),
                           Salary NUMBER,
                           Department VARCHAR2(50),
                           HireDate DATE
);

----------------------------------------------------
-- INSERT SAMPLE DATA
----------------------------------------------------

INSERT INTO Customers VALUES
    (1,'John Doe',TO_DATE('1955-05-15','YYYY-MM-DD'),10000,SYSDATE);

INSERT INTO Customers VALUES
    (2,'Jane Smith',TO_DATE('1990-07-20','YYYY-MM-DD'),15000,SYSDATE);

INSERT INTO Customers VALUES
    (3,'Robert King',TO_DATE('1958-01-10','YYYY-MM-DD'),12000,SYSDATE);

INSERT INTO Accounts VALUES
    (101,1,'Savings',10000,SYSDATE);

INSERT INTO Accounts VALUES
    (102,2,'Savings',15000,SYSDATE);

INSERT INTO Accounts VALUES
    (103,3,'Savings',12000,SYSDATE);

INSERT INTO Transactions VALUES
    (1,101,SYSDATE,500,'Deposit');

INSERT INTO Transactions VALUES
    (2,102,SYSDATE,300,'Withdrawal');

INSERT INTO Transactions VALUES
    (3,103,SYSDATE,1000,'Deposit');

INSERT INTO Loans VALUES
    (1,1,500000,9,SYSDATE,ADD_MONTHS(SYSDATE,60));

INSERT INTO Loans VALUES
    (2,2,300000,10,SYSDATE,ADD_MONTHS(SYSDATE,48));

INSERT INTO Loans VALUES
    (3,3,450000,8,SYSDATE,ADD_MONTHS(SYSDATE,72));

INSERT INTO Employees VALUES
    (1,'Alice Johnson','Manager',70000,'HR',
     TO_DATE('2015-06-15','YYYY-MM-DD'));

INSERT INTO Employees VALUES
    (2,'Bob Brown','Developer',60000,'IT',
     TO_DATE('2017-03-20','YYYY-MM-DD'));

COMMIT;

----------------------------------------------------
-- CONTROL STRUCTURES EXERCISE
----------------------------------------------------

BEGIN

FOR customer_rec IN
    (
        SELECT CustomerID,
               Name,
               FLOOR(MONTHS_BETWEEN(SYSDATE,DOB)/12) AS Age
        FROM Customers
    )

    LOOP

        IF customer_rec.Age > 60 THEN

UPDATE Loans
SET InterestRate = InterestRate - 1
WHERE CustomerID = customer_rec.CustomerID;

DBMS_OUTPUT.PUT_LINE(
                customer_rec.Name || ' received 1% discount on loan interest.'
            );

END IF;

END LOOP;

COMMIT;

END;
/

----------------------------------------------------
-- VERIFY RESULT
----------------------------------------------------

SELECT CustomerID,
       InterestRate
FROM Loans;