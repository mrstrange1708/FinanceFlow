'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface CalculatorProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export function Calculator({ onResult, onClose }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = performCalculation(parseFloat(currentValue), inputValue, operation);
      
      setDisplay(newValue.toString());
      setPreviousValue(newValue.toString());
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const performCalculation = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const calculate = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const currentValue = parseFloat(previousValue);
      const newValue = performCalculation(currentValue, inputValue, operation);
      
      setDisplay(newValue.toString());
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleResult = () => {
    if (operation && previousValue !== null) {
      calculate();
    }
    onResult(display);
  };

  const buttons = [
    ['C', '±', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-80 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Calculator</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardContent className="p-6">
          <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-right">
            <div className="text-2xl font-mono text-gray-900 dark:text-white">
              {display}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {buttons.flat().map((btn, index) => {
              const isOperator = ['+', '-', '*', '/', '='].includes(btn);
              const isSpecial = ['C', '±', '%'].includes(btn);
              
              return (
                <Button
                  key={index}
                  variant={isOperator ? 'default' : 'outline'}
                  className={`h-12 ${
                    btn === '0' ? 'col-span-2' : ''
                  } ${
                    isOperator ? 'bg-amber-600 hover:bg-amber-700' : ''
                  } ${
                    isSpecial ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500' : ''
                  }`}
                  onClick={() => {
                    if (btn === '=') {
                      handleResult();
                    } else if (btn === 'C') {
                      clear();
                    } else if (btn === '.') {
                      inputDecimal();
                    } else if (['+', '-', '*', '/'].includes(btn)) {
                      performOperation(btn);
                    } else if (!isNaN(Number(btn))) {
                      inputNumber(btn);
                    }
                  }}
                >
                  {btn}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}