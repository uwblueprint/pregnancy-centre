import React, { FunctionComponent, useContext } from "react";

import { EditTestimonialsContext, MapQuoteEditState } from "../../pages/AdminEditTestimonialsPage";
import MapQuoteEditCard from "./MapQuoteEditCard";

const MAX_MAP_QUOTES = 8;

const EditMapQuotesSection: FunctionComponent = () => {
    const { formState, setFormState } = useContext(EditTestimonialsContext);
    const { mapQuotes } = formState;

    const updateMapQuotesAndConfigState = (newMapQuotes: Array<MapQuoteEditState>) => {
        const configMapQotes = newMapQuotes
            .filter((mapQoute) => mapQoute.isSavedBefore)
            .map((mapQuote) => ({
                id: mapQuote.id,
                imagePath: mapQuote.imagePath,
                testimonial: mapQuote.testimonial
            }));
        setFormState({
            ...formState,
            mapQuotes: newMapQuotes,
            donorHomepageConfig: {
                ...formState.donorHomepageConfig,
                map: {
                    ...formState.donorHomepageConfig.map,
                    testimonials: configMapQotes
                }
            }
        });
    };

    const updateMapQuoteState = (newMapQuote: MapQuoteEditState) => {
        const imageError = newMapQuote.imagePath === "" ? newMapQuote.imageError : "";
        const textAreaError = newMapQuote.testimonial.length === 0 ? newMapQuote.textAreaError : "";
        const newMapQuotes = mapQuotes.map((oldMapQuote) =>
            oldMapQuote.id === newMapQuote.id ? { ...newMapQuote, imageError, textAreaError } : oldMapQuote
        );
        setFormState({
            ...formState,
            mapQuotes: newMapQuotes
        });
    };

    const saveMapQuote = (newMapQuote: MapQuoteEditState) => {
        const imageError = newMapQuote.imagePath === "" ? "A photo must be uploaded" : "";
        const textAreaError = newMapQuote.testimonial.length === 0 ? "Enter a map quote" : "";
        const newMapQuotes = mapQuotes.map((oldMapQuote) =>
            oldMapQuote.id === newMapQuote.id
                ? {
                      ...newMapQuote,
                      isEditing: imageError !== "" || textAreaError !== "",
                      isSavedBefore: newMapQuote.isSavedBefore || (imageError === "" && textAreaError === ""),
                      imageError,
                      textAreaError
                  }
                : oldMapQuote
        );
        updateMapQuotesAndConfigState(newMapQuotes);
    };

    const deleteMapQuote = (mapQuoteId: number) => {
        const newMapQuotes = mapQuotes.filter((mapQoute) => mapQoute.id !== mapQuoteId);
        updateMapQuotesAndConfigState(newMapQuotes);
    };

    const addMapQuote = () => {
        if (mapQuotes.length >= MAX_MAP_QUOTES) {
            return;
        }
        let maxIdNum = 1;
        mapQuotes.forEach((quote) => {
            maxIdNum = Math.max(maxIdNum, quote.id);
        });
        const nextAvailableId = maxIdNum + 1;
        setFormState({
            ...formState,
            mapQuotes: mapQuotes.concat({
                id: nextAvailableId,
                imagePath: "",
                isSavedBefore: false,
                testimonial: "",
                isEditing: true,
                imageError: "",
                textAreaError: ""
            })
        });
    };

    const clearChangesOnMapQuote = (mapQuoteId: number) => {
        const oldMapQoute = formState.donorHomepageConfig.map.testimonials.find(
            (mapQoute) => mapQoute.id === mapQuoteId
        );
        if (oldMapQoute == null) {
            deleteMapQuote(mapQuoteId);
            return;
        }
        const newMapQuotes = mapQuotes.map((mapQuote) => {
            if (mapQuote.id === mapQuoteId) {
                return {
                    id: oldMapQoute.id,
                    imageError: "",
                    imagePath: oldMapQoute.imagePath,
                    isSavedBefore: mapQuote.isSavedBefore,
                    isEditing: false,
                    testimonial: oldMapQoute.testimonial,
                    textAreaError: ""
                };
            }
            return mapQuote;
        });
        setFormState({
            ...formState,
            mapQuotes: newMapQuotes
        });
    };

    return (
        <div className="edit-map-quotes-section">
            <div className="section-header">
                <h1 className="title">Map Quotes</h1>
                {mapQuotes.length < MAX_MAP_QUOTES && (
                    <h1 className="add-map-quotes" onClick={addMapQuote}>
                        + Add another Map Quote
                    </h1>
                )}
            </div>
            <h1 className="map-quotes-counter">
                Total: {mapQuotes.length}/{MAX_MAP_QUOTES}
            </h1>
            <div className="cards">
                {mapQuotes.map((mapQoute) => (
                    <MapQuoteEditCard
                        clearChanges={clearChangesOnMapQuote}
                        deleteMapQuote={deleteMapQuote}
                        key={mapQoute.id}
                        mapQuote={mapQoute}
                        saveMapQuote={saveMapQuote}
                        updateMapQuote={updateMapQuoteState}
                    />
                ))}
            </div>
        </div>
    );
};

export default EditMapQuotesSection;
