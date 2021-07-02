import React, { FunctionComponent, useState } from "react";

import DonationForm, {
  ItemAge,
  ItemCondition,
  ItemConditionToDescriptionMap,
  ItemAgeToDescriptionMap,
} from "../../data/types/donationForm";
import FormItem from "../molecules/FormItem";
import RequestGroup from "../../data/types/requestGroup";
import SearchableDropdown from "../atoms/SearchableDropdown";
import { TextField } from "../atoms/TextField";
import ScrollableDropdown from "../atoms/ScrollableDropdown";
import TextArea from "../atoms/TextArea";

interface Props {
  onSave: (donationForm: DonationForm) => void;
  requestGroups: Array<RequestGroup>;
  showFormUnsavedError: boolean;
}

const DonationItemForm: FunctionComponent<Props> = (props: Props) => {
  const [name, setName] = useState("");
  // const [nameInput, setNameInput] = useState("");
  const [requestGroup, setRequestGroup] = useState<RequestGroup>(null);
  const [condition, setCondition] = useState<ItemCondition | null>(null);
  const [age, setAge] = useState(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [nameError, setNameError] = useState("");
  const [formError, setFormError] = useState("");
  const [isConditionErrorneous, setIsConditionErrorneous] = useState(false);
  // const [isAgeErrorneous, setIsAgeErrorneous] = useState("");
  const [isQuantityErrorneous, setIsQuantityErrorneous] = useState(false);
  // const [isDescriptionErrorneous, setIsDescriptionErrorneous] = useState("");
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
    const newRequestGroup = props.requestGroups.find(
      (requestGroup) => requestGroup.name === newItemName
    );
    if (newRequestGroup) {
      setRequestGroup(newRequestGroup);
    }
  };

  const updateIsConditionErrorneous = (condition?: ItemCondition): boolean => {
    if (condition == null) {
      setIsConditionErrorneous(true);
      return true;
    }
    setIsConditionErrorneous(false);
    return false;
  };

  // const isAgeErrorneous = (age?: ItemAge) => {
  //   if (condition == null) {
  //     return true;
  //   }
  //   return false;
  // };

  const updateIsQuantityErrorneous = (quantity: number): boolean => {
    if (quantity <= 0) {
      setIsQuantityErrorneous(true);
      return true;
    }
    setIsQuantityErrorneous(false);
    return false;
  };

  // const isDescriptionErrorneous = (condition?: ItemCondition) => {
  //   if (condition == null) {
  //     return true;
  //   }
  //   return false;
  // };

  const updateFormError = (
    condition: ItemCondition | null,
    quantity: number
  ): string => {
    let errors = [];
    if (updateIsConditionErrorneous(condition)) {
      errors.push("Item Condition");
    }
    if (updateIsQuantityErrorneous(quantity)) {
      errors.push("Quantity (number of this specific item)");
    }
    if (errors.length === 0) {
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
      props.onSave({
        age,
        condition,
        description,
        name,
        quantity,
        requestGroup,
      });
    }
  };

  return (
    <div className="donation-item-form">
      <div className="request-group-form-item">
        <FormItem
          formItemName="What item do you wish to donate?"
          errorString={nameError}
          isDisabled={false}
          showErrorIcon={false}
          inputComponent={
            <SearchableDropdown
              dropdownItems={props.requestGroups.map(
                (requestGroup) => requestGroup.name
              )}
              initialText={name}
              isDisabled={false}
              isErroneous={false}
              noItemsAction={
                <>
                  <span>{name}</span>
                  <span>— enter your own item</span>
                </>
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onNameChange(e.target.value);
              }}
              onSelect={onNameChange}
              placeholderText="Enter item name"
              searchPlaceholderText=""
            />
          }
        />
      </div>
      <div className="details-card">
        <FormItem
          formItemName="Item Condition *"
          errorString=""
          isErroneous={isConditionErrorneous}
          isDisabled={false}
          showErrorIcon={false}
          inputComponent={
            <ScrollableDropdown
              trigger={
                <TextField
                  input={condition}
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
              dropdownItems={Object.values(ItemCondition).map(
                (conditionValue) => (
                  <span onClick={() => onConditionChange(conditionValue)}>
                    {ItemConditionToDescriptionMap[conditionValue]}
                  </span>
                )
              )}
              onDropdownClose={() => {}}
              onDropdownOpen={() => {}}
              isDropdownOpened={isConditionDropdownOpen}
            />
          }
        />
        <FormItem
          formItemName="Age of Item *"
          errorString=""
          isDisabled={false}
          showErrorIcon={false}
          tooltipText="Please select the approximate number of years you have had this item"
          inputComponent={
            <ScrollableDropdown
              trigger={
                <TextField
                  input={ItemAgeToDescriptionMap[age]}
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
                ([ageKey, description]) => (
                  <span onClick={() => onAgeChange(ageKey)}>{description}</span>
                )
              )}
              onDropdownClose={() => {}}
              onDropdownOpen={() => {}}
              isDropdownOpened={isAgeDropdownOpen}
            />
          }
        />
        <FormItem
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
      </div>
      {(formError.length !== 0 || props.showFormUnsavedError) && (
        <div>
          <i className="form-item-error-icon bi bi-exclamation-circle alert-icon" />
          {formError.length !== 0
            ? formError
            : "Please save item to proceed to the next step."}
        </div>
      )}
    </div>
  );
};

export default DonationItemForm;
