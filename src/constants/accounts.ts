export const AccountsTypesMap = {
	savings: "Savings Account",
	checking: "Checking Account",
	credit_card: "Credit Card",
	investment: "Investment",
	other: "Other",
};

export const AccountTypeItems = Object.entries(AccountsTypesMap).map(
	([value, label]) => ({ value, label }),
);
