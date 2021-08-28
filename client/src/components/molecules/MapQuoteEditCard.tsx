import React, { ChangeEvent, FunctionComponent, useState } from "react";

import { EditTestimonialsContext, MapQuoteEditState } from "../../pages/AdminEditTestimonialsPage";
import { Button } from "../atoms/Button";
import CircleImage from "../atoms/CircleImage";
import { MapQuote } from "../../data/types/donorHomepageConfig";
import TextArea from "../atoms/TextArea";
import UploadImageModal from "../organisms/UploadImageModal";

const MAX_QUOTE_LENGTH = 175;

interface Props {
    clearChanges: (mapQuoteId: number) => void;
    deleteMapQuote: (mapQuoteId: number) => void;
    mapQuote: MapQuoteEditState;
    updateMapQuote: (newMapQuote: MapQuoteEditState) => void;
}

const MapQuoteEditCard: FunctionComponent<Props> = (props: Props) => {
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);

    const onChangeQuote = (newQuote: string) => {
        if (newQuote.length <= MAX_QUOTE_LENGTH) {
            props.updateMapQuote({ ...props.mapQuote, testimonial: newQuote });
        }
    };

    const onChangeImage = (newImagePath: string) => {
        props.updateMapQuote({ ...props.mapQuote, imagePath: newImagePath });
        setShowUploadImageModal(false);
    };

    const onSave = () => {
        props.updateMapQuote({ ...props.mapQuote, isEditing: false });
    };

    const onEdit = () => {
        props.updateMapQuote({ ...props.mapQuote, isEditing: true });
    };

    const onDelete = () => {
        props.deleteMapQuote(props.mapQuote.id);
    };

    if (props.mapQuote.isEditing) {
        return (
            <>
                {showUploadImageModal && (
                    <UploadImageModal handleClose={() => setShowUploadImageModal(false)} onSubmit={onChangeImage} />
                )}
                <div className="edit-map-quote-card">
                    <div className="form-fields">
                        <div className="form-fields-left">
                            <CircleImage imagePath={props.mapQuote.imagePath} />
                            <h1 onClick={() => setShowUploadImageModal(true)}>Change Photo</h1>
                        </div>
                        <div className="form-fields-right">
                            <div className="text-area-label">
                                <h1>Client Quote</h1>
                                <h1>
                                    {props.mapQuote.testimonial.length}/{MAX_QUOTE_LENGTH}
                                </h1>
                            </div>
                            <TextArea
                                isErroneous={false}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                                    onChangeQuote(event.target.value)
                                }
                                placeholder="Enter map quote"
                                value={props.mapQuote.testimonial}
                            />
                        </div>
                    </div>
                    <div className="form-footer">
                        <div className="form-footer-left">
                            <i className="bi bi-trash" onClick={onDelete} />
                        </div>
                        <div className="form-footer-right">
                            <Button
                                className="cancel-button"
                                text="Cancel"
                                onClick={() => props.clearChanges(props.mapQuote.id)}
                                copyText=""
                            />
                            <Button className="save-button" text="Update" onClick={onSave} copyText="" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="preview-map-quote-card">
            <div className="card-left">
                <CircleImage imagePath={props.mapQuote.imagePath} />
            </div>
            <div className="card-right">
                <p>{props.mapQuote.testimonial}</p>
                <div className="card-icons">
                    <i className="bi bi-trash" onClick={onDelete} />
                    <i className="bi bi-pencil" onClick={onEdit} />
                </div>
            </div>
        </div>
    );
};

export default MapQuoteEditCard;
