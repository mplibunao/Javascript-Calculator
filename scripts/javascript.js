/*	@ Global Variables
	@ expression is the placeholder variable for the string value of the whole expression Eg. 4+2+3
	@ arrayExpression is the array form of the expression; Each index value contains one sub-expression or operator Eg. ['234.12', '+', '934', '*', '5'];
	@ currentIndex helps the program track if subsequent inputs will concatenate to the current sub-expression or move on to the next sub-expression (usually operators)
*/
	var expression ="";
	var currentExpression = "0";
	var currentIndex = 0;
	var arrayExpression = [];
	
	


	/*	@ Checks what type of input was passed and calls/does appropriate action
		@ Passes input to the corresponding handler function
	*/
	var checkInput = function(input){
		if (input == '.'){
			//call dot handler
			dotInput();
		} else if (input == "+" || input == "-" || input == "/" || input == "*"){
			//call operator handler
			operatorInput(input);
		} else if (input == "ac" || input == "ce"){
			//call clear function handler
			clear(input);
		} else if (input == "="){
			//call eval handler
			evaluateExpression();
		} else {
			for (var i=0; i<10; i++){
				if (input == i){
					//call number handler
					numberInput(input);
				}
			}
		}
	};

	/*	@ Either clear all or clear entry
		@ Resets the ff: currentIndex, arrayExpression, currentExpression and expression
		@ For CE, check if currentExpression is number or not (+-/*)
			Set currentExpression to 0 if number; Else delete that array index and go back 1 index

	*/
	var clear = function(clearType){
		if (clearType === "ac"){
			currentIndex = 0;
			arrayExpression.length = 0;
			currentExpression = '0';
			updateCurrentAndHistory();
		} else if (clearType === "ce"){
			console.log(currentExpression);
			if (isNaN(currentExpression) === false && currentExpression != ""){
				currentExpression = '0';	
			} else{
				currentIndex--;
				arrayExpression.pop();
				currentExpression = arrayExpression[currentIndex];
			}
			
			updateCurrentAndHistory();
		}
	}

	/*	@ Handles logic when input is '.'
		@ searches the currentExpression for '.' and concatenates the . to the expression if no existing match
	*/
	var dotInput = function(){
		if (/\./g.test(currentExpression) === false){
			currentExpression += '.';
			updateCurrentAndHistory();
		}
	}

	/*	@ Handles login when input is =
		@ Uses eval on expression variable
		@ If currentExpression is not = 0 or .0 && previousExpression not an operator
		@ Creates seperate index for '=' and result so they do not show-up together in the currentExpression
		@ Clear arrays after and replace with result

	*/
	var evaluateExpression = function(){
		if (/(0$|^0\.$)/g.test(currentExpression) === false && /[^A-Za-z\.\d]/g.test(arrayExpression[currentIndex]) === false){
			var result = eval(expression);
			currentIndex++;
			currentExpression = '=';
			updateCurrentAndHistory();
			currentIndex++;
			currentExpression = result;
			updateCurrentAndHistory();

			//reset values except result
			currentIndex=0;
			currentExpression="="+result;
			arrayExpression.length=0;
			arrayExpression[currentIndex] = result;
			arrayExpToString();

			console.log("currentIndex: " + currentIndex);
			console.log("currentExpression: "+ currentExpression);
			console.log(arrayExpression);
			console.log("expression: "+expression);


		}
	}

	/*	@ Handles logic when input is an operator
		- @ Only proceed with adding the operator if the currentExpression is not '0' or '0.' (1st if)
		- @ After initial check, check if previous expression is also an operator; If yes, overwrite it to prevent (2+/*+3) (2nd if)
			Else increment index and write there
		@ Increments currentIndex so when updateCurrentAndHistory runs, it's stored on a seperate index
		@ Increments currentIndex again after Updating so next input (number or . ) goes on a different index too.
		@ Clear currentExpression since numbers are appended += to each other not assigned =
	*/
	var operatorInput = function(operator){
		if (/(^0$|^0\.$)/g.test(currentExpression) === false ){
			//console.log(/[^A-Za-z\.\d]/g.test(arrayExpression[currentIndex]));
			if (/[^A-Za-z\.\d=]/g.test(arrayExpression[currentIndex]) === false){
				currentIndex++;
			}

			currentExpression = operator;
			updateCurrentAndHistory();
			//currentIndex++;
			currentExpression = "";
		}
		
	}

	/*	@ Handles logic when input is number
		@ If currentExpressions has only 0 then replace that value with number
		  Else, if currentExpression has no '=', concat number with currentExpression then update arrayExpression, expression var and the view
		@ Else (has =), then clear
	*/
	var numberInput = function(number){

		if (currentExpression === ""){
			currentIndex++;
		}

		var expLength = currentExpression.length;
		if (expLength == 1 && currentExpression[0] == "0"){
			currentExpression = number;
			updateCurrentAndHistory();
		//} else if (isNaN(number) === false){	
		} else if (/[=]/g.test(currentExpression) === false){
			currentExpression += number;
			updateCurrentAndHistory();
		} else {
			//clear then add number as usual.
			clear('ac');
			currentExpression = number;
			updateCurrentAndHistory();
		}
	}


	/*	@ Helper function for updating the current value and history in the calculator
		@ Updates array value of arrayExpression then joins them using arrayExpToString() to display as history
		@ Makes use of setAnswer() and setHistory() to display
		@ If currentExpression exceeds 9 digits, call clear function and set error message
		@ IF history or overall expression exceeds 25 digits/characters, call clear function and set error message
	*/
	var updateCurrentAndHistory = function(){
		if (currentExpression.length > 8){
			//call clear function here
			//clear function clears the global variables and resets the view
			$('#history-val').html('Digit Limit Met');
		} else if (expression.length > 25){
			//call clear function here
			$('#history-val').html('Expression Too Long');
		} else{
			//update current value
			setAnswer();
			//update history
			arrayExpression[currentIndex] = currentExpression;
			arrayExpToString();
			setHistory();
		}
		
	}


	//	concatenate the expression array values into one string for evaluation
	var arrayExpToString = function(){
		expression = arrayExpression.join('');
	}
	// 	@ Set value in display
	var setAnswer = function(){
		$('#answer').html(currentExpression);
	}
	//set value in history
	var setHistory = function(){
		$('#history-val').html(expression);
	}



$(document).ready(function(){

//	@ Initialize expression and set the values in the calculator
updateCurrentAndHistory();


/*	@ Event listener for the buttons
	@ input is the placeholder variable for the value of the button pressed
	@ screenDisplay is the string which contains 
*/
$('button').on('click', function(){
	var input = $(this).val();
	checkInput(input);
	

	/*
	check if input is a number, operator or function
	use function to check what value that input was
	
	- if number or . check first the current value in the screen
	if 0, then delete that 0 and add input (except for .)
		else get the value and append the new input 
	print it in screen and history

	- if operator was pressed check first the last value in expression
		if it was another operator then replace that operator with this new operator
	
	*/


})


});