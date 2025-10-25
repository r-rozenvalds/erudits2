import { useState } from "react";
import { IQuestion } from "../../../../stores/interfaces/creator/IQuestion";
import { BasicModal } from "../../ui/BasicModal";
import { constants } from "../../../../constants";

interface IImageUploadModal {
  onConfirm: (guidelines: string, image: File) => void;
  onCancel: () => void;
  question: IQuestion;
}

export const ImageUploadModal = ({
  question,
  onConfirm,
  onCancel,
}: IImageUploadModal) => {
  const [guidelines, setGuidelines] = useState<string | undefined>(
    question.guidelines
  );
  const [image, setImage] = useState<File>();

  const handleImageDelete = () => {
    if (image) {
      setImage(undefined);
      return;
    }
  };

  return (
    <BasicModal
      title="Attēlu augšupielāde"
      isLoading={false}
      onConfirm={() => null}
      onCancel={onCancel}
    >
      <div className="w-full h-full bg-slate-200 rounded-sm">
        <div
          className="min-w-80 min-h-48 relative"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setImage(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => {
            document.getElementById("imageUpload")?.click();
          }}
        >
          <div className="flex justify-center items-center h-full">
            <img
              className="max-h-96 max-w-96 object-contain p-1 z-50"
              src={
                image
                  ? URL.createObjectURL(image)
                  : constants.baseImgUrl + question.image_url
              }
            ></img>
          </div>
          {!image && !question.image_url && (
            <i className="fa-solid fa-image text-slate-300 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl"></i>
          )}
        </div>
        <div className="flex place-items-center gap-2 bg-slate-300">
          <label
            className="rounded-sm h-8 w-8 bg-slate-400 flex place-items-center justify-center hover:cursor-pointer hover:bg-opacity-80"
            htmlFor="imageUpload"
          >
            <i className="fa-solid fa-arrow-up-from-bracket"></i>
          </label>
          <input
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }
            }}
            multiple={false}
            id="imageUpload"
            className="hidden"
            type="file"
            accept="image/*"
          ></input>
          <label htmlFor="imageUpload" className="truncate max-w-96">
            {image ? image.name : "Augšupielādēt"}
          </label>
          <button
            onClick={handleImageDelete}
            className="ml-auto px-2 text-red-500 h-8 hover:text-red-400"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <label htmlFor="textInput" className="text-sm">
          Ievades instrukcijas spēlētājam
          <i
            title="Vadlīnijas spēlētājam, rakstiski atbildot uz jautājumu."
            className="ms-1 fa-regular fa-circle-question"
          ></i>
        </label>
        <input
          id="textInput"
          type="text"
          value={guidelines}
          onChange={(e) => setGuidelines(e.target.value)}
          className="h-8 px-2 min-w-96 bg-slate-100 font-medium mt-1"
          placeholder="Nominatīvā, vienskaitlī, ar lielo sākuma burtu..."
        />
      </div>
    </BasicModal>
  );
};
