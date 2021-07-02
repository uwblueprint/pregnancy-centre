import React, { FunctionComponent, useState } from "react";

import DonationForm, {
    ItemAgeToDescriptionMap,
    ItemCondition,
    ItemConditionToDescriptionMap
} from "../../data/types/donationForm";
import { Button } from "../atoms/Button";
import FormItem from "../molecules/FormItem";
import RequestGroup from "../../data/types/requestGroup";
import ScrollableDropdown from "../atoms/ScrollableDropdown";
import SearchableDropdown from "../atoms/SearchableDropdown";
import TextArea from "../atoms/TextArea";
import { TextField } from "../atoms/TextField";

interface Props {
    onDelete: () => void;
    onSave: (donationForm: DonationForm) => void;
    requestGroups: Array<RequestGroup>;
    showFormUnsavedError: boolean;
}

const DonationItemForm: FunctionComponent<Props> = (props: Props) => {
    const [name, setName] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [condition, setCondition] = useState<ItemCondition | null>(null);
    const [age, setAge] = useState(1);
    const [quantity, setQuantity] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const [nameError, setNameError] = useState("");
    const [formError, setFormError] = useState("");
    const [isConditionErrorneous, setIsConditionErrorneous] = useState(false);
    const [isQuantityErrorneous, setIsQuantityErrorneous] = useState(false);
    const [isConditionDropdownOpen, setIsConditionDropdownOpen] = useState(false);
    const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);

    const updateNameError = (itemName: string) => {
        let error = "";
        if (itemName.length === 0) {
            error = "Please enter Item name";
        }

        setNameError(error);
        return error;
    };

    const onNameChange = (newItemName: string) => {
        updateNameError(newItemName);
        setName(newItemName);
        setNameInput(newItemName);
    };

    const updateIsConditionErrorneous = (condition: ItemCondition | null): boolean => {
        if (condition == null) {
            setIsConditionErrorneous(true);
            return true;
        }
        setIsConditionErrorneous(false);
        return false;
    };

    const updateIsQuantityErrorneous = (quantity: number): boolean => {
        if (quantity <= 0 || isNaN(quantity)) {
            setIsQuantityErrorneous(true);
            return true;
        }
        setIsQuantityErrorneous(false);
        return false;
    };

    const updateFormError = (condition: ItemCondition | null, quantity: number): string => {
        const errors = [];
        if (updateIsConditionErrorneous(condition)) {
            errors.push("Item Condition");
        }
        if (updateIsQuantityErrorneous(quantity)) {
            errors.push("Quantity (number of this specific item)");
        }
        if (errors.length === 0) {
            setFormError("");
            return "";
        }
        let errorString = "Please enter valid";
        errors.forEach((error, idx) => {
            if (idx === errors.length - 1 && errors.length > 1) {
                errorString = errorString.concat(" and");
            }
            errorString = errorString.concat(" " + error);
        });
        errorString = errorString.concat(".");
        setFormError(errorString);

        return errorString;
    };

    const onConditionChange = (newCondition: ItemCondition) => {
        setCondition(newCondition);
        setIsConditionDropdownOpen(false);
        updateFormError(newCondition, quantity);
    };

    const onAgeChange = (newAge: number) => {
        setAge(newAge);
        setIsAgeDropdownOpen(false);
    };

    const onQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
        updateFormError(condition, newQuantity);
    };

    const onDescriptionChange = (newDescription: string) => {
        setDescription(newDescription);
    };

    const onSave = () => {
        const nameError = updateNameError(name);
        const formError = updateFormError(condition, quantity);

        if (nameError.length === 0 && formError.length === 0) {
            const itemRequestGroup = props.requestGroups.find((requestGroup) => requestGroup.name === name);

            props.onSave({
                age,
                condition: condition ?? undefined,
                description,
                name,
                quantity,
                requestGroup: itemRequestGroup ?? null
            });
        }
    };

    return (
        <div className="donation-item-form">
            <FormItem
                className="item-name-field"
                formItemName="What item do you wish to donate?"
                errorString={nameError}
                isDisabled={false}
                showErrorIcon={false}
                inputComponent={
                    <SearchableDropdown
                        selectedItem={name}
                        searchString={nameInput}
                        dropdownItems={props.requestGroups.reduce(
                            (acc, requestGroup) => (requestGroup.name ? acc.concat(requestGroup.name) : acc),
                            [] as Array<string>
                        )}
                        initialText={nameInput}
                        isDisabled={false}
                        isErroneous={nameError.length !== 0}
                        actionOption={
                            nameInput.length === 0 ? null : (
                                <div onClick={() => onNameChange(nameInput)}>
                                    <span>{nameInput}</span>
                                    <span className="custom-item-prompt">- enter your own item</span>
                                </div>
                            )
                        }
                        onChange={setNameInput}
                        onSelect={onNameChange}
                        placeholderText="Enter item name"
                        searchPlaceholderText=""
                    />
                }
            />
            <div className="details-card">
                <FormItem
                    className="item-condition-field"
                    formItemName="Item Condition *"
                    errorString=""
                    isErroneous={isConditionErrorneous}
                    isDisabled={false}
                    showErrorIcon={false}
                    inputComponent={
                        <ScrollableDropdown
                            trigger={
                                <TextField
                                    input={condition ? ItemConditionToDescriptionMap.get(condition) ?? "" : ""}
                                    isDisabled={false}
                                    isErroneous={isConditionErrorneous}
                                    onChange={() => {}}
                                    name="condition"
                                    placeholder="Select Item Condition..."
                                    type="text"
                                    showRedErrorText={true}
                                    readOnly={true}
                                    iconClassName="bi bi-caret-down-fill"
                                />
                            }
                            dropdownItems={
                                <>
                                    <p>Select condition</p>
                                    {Object.values(ItemCondition).map((conditionValue) => (
                                        <span key={conditionValue} onClick={() => onConditionChange(conditionValue)}>
                                            {ItemConditionToDescriptionMap.get(conditionValue)}
                                        </span>
                                    ))}
                                </>
                            }
                            onDropdownClose={() => {
                                setIsConditionDropdownOpen(false);
                            }}
                            onDropdownOpen={() => {
                                setIsConditionDropdownOpen(true);
                            }}
                            isDropdownOpened={isConditionDropdownOpen}
                        />
                    }
                />
                <FormItem
                    className="item-age-field"
                    formItemName="Age of Item *"
                    errorString=""
                    isDisabled={false}
                    showErrorIcon={false}
                    tooltipText="Please select the approximate number of years you have had this item"
                    inputComponent={
                        <ScrollableDropdown
                            trigger={
                                <TextField
                                    input={ItemAgeToDescriptionMap.get(age) ?? ""}
                                    isDisabled={false}
                                    isErroneous={false}
                                    onChange={() => {}}
                                    name="age"
                                    placeholder=""
                                    type="text"
                                    showRedErrorText={true}
                                    readOnly={true}
                                    iconClassName="bi bi-caret-down-fill"
                                />
                            }
                            dropdownItems={Array.from(ItemAgeToDescriptionMap.entries()).map(
                                ([ageKey, description]) =>
                                    ageKey > 0 && (
                                        <span key={ageKey} onClick={() => onAgeChange(ageKey)}>
                                            {description}
                                        </span>
                                    )
                            )}
                            onDropdownClose={() => {
                                setIsAgeDropdownOpen(false);
                            }}
                            onDropdownOpen={() => {
                                setIsAgeDropdownOpen(true);
                            }}
                            isDropdownOpened={isAgeDropdownOpen}
                        />
                    }
                />
                <FormItem
                    className="item-quantity-field"
                    formItemName="Quantity *"
                    errorString=""
                    isDisabled={false}
                    showErrorIcon={false}
                    tooltipText="Please input the number of identical items you are requesting to donate"
                    inputComponent={
                        <TextField
                            input={quantity.toString()}
                            isDisabled={false}
                            isErroneous={isQuantityErrorneous}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                onQuantityChange(parseInt(e.target.value));
                            }}
                            name="quantity"
                            placeholder=""
                            type="number"
                            showRedErrorText={true}
                        />
                    }
                />
                <FormItem
                    className="item-description-field"
                    formItemName="Item Description"
                    errorString=""
                    isDisabled={false}
                    showErrorIcon={false}
                    inputComponent={
                        <TextArea
                            isErroneous={false}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                onDescriptionChange(e.target.value);
                            }}
                            placeholder="Tell us a little bit about your item. E.x. the bottle is plastic and is 500mL"
                            value={description}
                        />
                    }
                />
                <div className="form-buttons">
                    <Button className="delete-button" text="Delete" copyText="" onClick={props.onDelete} />
                    <Button className="save-button" text="Save Item" copyText="" onClick={onSave} />
                </div>
            </div>
            {(formError.length !== 0 || props.showFormUnsavedError) && (
                <div className="form-error">
                    <i className="bi bi-exclamation-circle alert-icon" />
                    <span>{formError.length !== 0 ? formError : "Please save item to proceed to the next step."}</span>
                </div>
            )}
        </div>
    );
};

export default DonationItemForm;
