import { useState } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { ToastMessage } from "../components/ToastMessage";
import useUser from "../hooks/useUser";
import axios from "axios";

const CreateNewArticle = () => {
  const [generating, setGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [generatedImageUrl, getGeneratedImageUrl] = useState("");
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    generatedContent: "",
    imageUrl: "",
    images: {},
    isGenerated: false,
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };
  const handleImageFilesChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/articles`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 201) {
        setToastMessage("Awesome!! Your post has been created successfully.");
      } else {
        setToastMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      setToastMessage("Error saving your post. Please try again.");
    }
    setShowToast(true);
  };

  const generateContent = async () => {
    setGenerating(true);
    if (!formData?.title) {
      return false;
    }
    try {
      const contentResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/generate/content`,
        {
          title: formData.title,
        }
      );
      const imageResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/generate/image`,
        {
          title: formData.title,
        }
      );
      setFormData((prevData) => ({
        ...prevData,
        generatedContent: contentResponse.data.generatedContent,
      }));
      getGeneratedImageUrl(imageResponse.data.imageUrl);
      setGenerating(false);
    } catch (error) {
      console.error("Error generating content:", error);
      setGenerating(false);
    }
  };

  return (
    <Container>
      <h2 className="gradient-text">New Blog Post</h2>
      <Form onSubmit={handleSubmit} className="space-y-4">
        <Form.Group controlId="title" className="mb-2">
          <Form.Label className="font-medium">Title:</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="what's on your mind"
            required
          />
        </Form.Group>
        <Form.Check
          type="switch"
          id="custom-switch"
          name="isGenerated"
          label="Generate with AI"
          checked={formData.isGenerated}
          onChange={handleChange}
        />
        {formData.isGenerated ? (
          <Form.Group controlId="content" className="mb-2">
            <Form.Label className="font-medium">Generated Content:</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              name="content"
              value={formData.generatedContent || ""}
              onChange={handleChange}
              required
              placeholder="Text will be generated here (PS: this is a primitive text generator only for demo purpose)"
            />
            {generating && (
              <p className="text-purple-700 my-1">
                Generating content with image, please be patient &#128517;
              </p>
            )}
            <Button onClick={generateContent} type="button" className="mt-2">
              Generate Content
            </Button>
          </Form.Group>
        ) : (
          <Form.Group controlId="content" className="mb-2">
            <Form.Label className="font-medium">Content:</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Start typing..."
            />
          </Form.Group>
        )}
        {generatedImageUrl && (
          <Form.Group controlId="generatedImageUrl" className="mb-2">
            <Form.Label className="font-medium" for="generatedImageUrl">
              Generated Image:
            </Form.Label>
            <Image
              src={generatedImageUrl}
              name="generatedImageUrl"
              width={300}
              height={300}
              alt="Generated"
              className="mt-1 d-block"
            />
          </Form.Group>
        )}
        <Form.Group controlId="images" className="mb-2">
          <Form.Label className="font-medium">Upload Image:</Form.Label>
          <Form.Control
            type="file"
            name="profilePic"
            multiple
            onChange={handleImageFilesChange}
          />
        </Form.Group>
        <Form.Group controlId="imageUrl" className="mb-2">
          <Form.Label className="font-medium">External Image Url:</Form.Label>
          <Form.Control
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="enter image url"
          />
        </Form.Group>
        <Form.Group controlId="date" className="mb-2">
          <Form.Label className="font-medium">Date:</Form.Label>
          <Form.Control
            type="text"
            name="date"
            value={formData.date}
            readOnly
          />
        </Form.Group>
        <Button
          variant={user ? "warning" : "secondary"}
          type="submit"
          className="my-4"
          disabled={!user}
        >
          {user ? "Submit" : "Login to Submit"}
        </Button>
        <ToastMessage
          show={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
        />
      </Form>
    </Container>
  );
};
export default CreateNewArticle;
