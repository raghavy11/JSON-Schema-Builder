import { useState, useEffect } from "react"
import { Input, Button, Select, Card, Tabs, Typography, Space, Divider, Badge, Tooltip } from "antd"
import {
  PlusOutlined,
  DeleteOutlined,
  CodeOutlined,
  SettingOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  StarOutlined,
} from "@ant-design/icons"
import { convertToJSONSchema } from "../utils/convertToJSONSchema"
import styles from "./schema-builder.module.css";


const { Option } = Select
const { Title, Text } = Typography

const createDefaultField = () => ({
  key: "",
  type: "String",
  children: [],
  id: Math.random().toString(36).substr(2, 9),
})

const FIELD_TYPE_COLORS = {
  String: {
    background: "linear-gradient(135deg, #e6f4ff 0%, #bae0ff 100%)",
    borderColor: "#91caff",
    textColor: "#1677ff",
    glowEffect: "0 0 20px rgba(22, 119, 255, 0.3)",
  },
  Number: {
    background: "linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)",
    borderColor: "#ffc069",
    textColor: "#fa8c16",
    glowEffect: "0 0 20px rgba(250, 140, 22, 0.3)",
  },
  Nested: {
    background: "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
    borderColor: "#95de64",
    textColor: "#52c41a",
    glowEffect: "0 0 20px rgba(82, 196, 26, 0.3)",
  },
}

const FieldRow = ({ field, onChange, onDelete, nestingLevel = 0, isNewlyAdded = false }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeletingField, setIsDeletingField] = useState(false)
  const [showNewFieldAnimation, setShowNewFieldAnimation] = useState(isNewlyAdded)

  useEffect(() => {
    if (showNewFieldAnimation) {
      const animationTimer = setTimeout(() => {
        setShowNewFieldAnimation(false)
      }, 600)

      return () => clearTimeout(animationTimer)
    }
  }, [showNewFieldAnimation])

  const handleFieldChange = (newValue, propertyName) => {
    onChange({ ...field, [propertyName]: newValue })
  }

  const handleNestedFieldChange = (childIndex, updatedChild) => {
    const updatedChildren = [...field.children]
    updatedChildren[childIndex] = updatedChild
    onChange({ ...field, children: updatedChildren })
  }

  const addNestedField = () => {
    const newNestedField = createDefaultField()
    const updatedField = {
      ...field,
      children: [...field.children, { ...newNestedField, isNew: true }],
    }
    onChange(updatedField)
  }

  const removeNestedField = (childIndex) => {
    const updatedChildren = [...field.children]
    updatedChildren.splice(childIndex, 1)
    onChange({ ...field, children: updatedChildren })
  }

  const handleFieldDeletion = () => {
    setIsDeletingField(true)
    setTimeout(() => {
      onDelete()
    }, 500)
  }

  const currentFieldTypeStyle = FIELD_TYPE_COLORS[field.type] || FIELD_TYPE_COLORS.String

  const getFieldRowClasses = () => {
    if (isDeletingField) return `${styles.fieldRowContainer} ${styles.fieldRowDeleting}`
    if (showNewFieldAnimation) return `${styles.fieldRowContainer} ${styles.fieldRowNew}`
    return `${styles.fieldRowContainer} ${styles.fieldRowNormal}`
  }

  const getFieldCardClasses = () => {
    return `${styles.fieldCard} ${isHovered ? styles.fieldCardHovered : styles.fieldCardNormal}`
  }

  return (
    <div className={getFieldRowClasses()}>
      <Card
        size="small"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={getFieldCardClasses()}
        style={{
          marginLeft: `${nestingLevel * 24}px`,
          background: nestingLevel === 0 ? "#ffffff" : "#fafafa",
          border: `2px solid ${
            isHovered ? currentFieldTypeStyle.borderColor : nestingLevel === 0 ? "#d9d9d9" : "#e8e8e8"
          }`,
          boxShadow: isHovered
            ? `${currentFieldTypeStyle.glowEffect}, 0 8px 25px rgba(0,0,0,0.15)`
            : nestingLevel === 0
              ? "0 2px 8px rgba(0,0,0,0.06)"
              : "0 1px 4px rgba(0,0,0,0.04)",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Space style={{ flex: 1 }}>
              <div className={styles.fieldInputContainer}>
                <Input
                  placeholder="Enter field name"
                  value={field.key}
                  onChange={(e) => handleFieldChange(e.target.value, "key")}
                  className={styles.fieldInput}
                  style={{
                    border: `2px solid ${field.key ? currentFieldTypeStyle.borderColor : "#d9d9d9"}`,
                    background: field.key ? currentFieldTypeStyle.background : "#ffffff",
                  }}
                  prefix={
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Key:
                    </Text>
                  }
                />

                {field.key && (
                  <div
                    className={styles.starIndicator}
                    style={{
                      background: currentFieldTypeStyle.textColor,
                    }}
                  >
                    <StarOutlined className={styles.starIcon} />
                  </div>
                )}
              </div>

              <Select
                value={field.type}
                onChange={(value) => handleFieldChange(value, "type")}
                className={styles.typeSelect}
                dropdownClassName={styles.typeSelectDropdown}
                optionLabelProp="label"
              >
                <Option
                  value="String"
                  label={
                    <Space>
                      <Badge color={FIELD_TYPE_COLORS.String.textColor} />
                      <span>String</span>
                    </Space>
                  }
                >
                  <div
                    className={styles.typeOption}
                    onMouseEnter={(e) => {
                      e.target.style.background = FIELD_TYPE_COLORS.String.background
                      e.target.classList.add(styles.typeOptionHovered)
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent"
                      e.target.classList.remove(styles.typeOptionHovered)
                    }}
                  >
                    <Badge color={FIELD_TYPE_COLORS.String.textColor} />
                    <span className={styles.typeOptionText}>String</span>
                    <ThunderboltOutlined
                      className={styles.typeIcon}
                      style={{ color: FIELD_TYPE_COLORS.String.textColor }}
                    />
                  </div>
                </Option>

                <Option
                  value="Number"
                  label={
                    <Space>
                      <Badge color={FIELD_TYPE_COLORS.Number.textColor} />
                      <span>Number</span>
                    </Space>
                  }
                >
                  <div
                    className={styles.typeOption}
                    onMouseEnter={(e) => {
                      e.target.style.background = FIELD_TYPE_COLORS.Number.background
                      e.target.classList.add(styles.typeOptionHovered)
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent"
                      e.target.classList.remove(styles.typeOptionHovered)
                    }}
                  >
                    <Badge color={FIELD_TYPE_COLORS.Number.textColor} />
                    <span className={styles.typeOptionText}>Number</span>
                    <ThunderboltOutlined
                      className={styles.typeIcon}
                      style={{ color: FIELD_TYPE_COLORS.Number.textColor }}
                    />
                  </div>
                </Option>

                <Option
                  value="Nested"
                  label={
                    <Space>
                      <Badge color={FIELD_TYPE_COLORS.Nested.textColor} />
                      <span>Nested</span>
                    </Space>
                  }
                >
                  <div
                    className={styles.typeOption}
                    onMouseEnter={(e) => {
                      e.target.style.background = FIELD_TYPE_COLORS.Nested.background
                      e.target.classList.add(styles.typeOptionHovered)
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent"
                      e.target.classList.remove(styles.typeOptionHovered)
                    }}
                  >
                    <Badge color={FIELD_TYPE_COLORS.Nested.textColor} />
                    <span className={styles.typeOptionText}>Nested</span>
                    <ThunderboltOutlined
                      className={styles.typeIcon}
                      style={{ color: FIELD_TYPE_COLORS.Nested.textColor }}
                    />
                  </div>
                </Option>
              </Select>
            </Space>

            <Tooltip title="Remove this field" placement="top">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleFieldDeletion}
                disabled={isDeletingField}
                className={styles.deleteButton}
                style={{
                  transform: isHovered && !isDeletingField ? "scale(1.1) rotate(-5deg)" : "scale(1) rotate(0deg)",
                  background: isDeletingField ? "#ff4d4f" : "",
                  color: isDeletingField ? "white" : "",
                }}
                size="small"
                onMouseEnter={(e) => {
                  if (!isDeletingField) {
                    e.currentTarget.classList.add(styles.deleteButtonHovered)
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeletingField) {
                    e.currentTarget.classList.remove(styles.deleteButtonHovered)
                  }
                }}
              >
                {isDeletingField ? "Removing..." : "Remove"}
              </Button>
            </Tooltip>
          </Space>

          {field.key && (
            <div
              className={styles.fieldTypeDisplay}
              style={{
                background: currentFieldTypeStyle.background,
                border: `2px solid ${currentFieldTypeStyle.borderColor}`,
              }}
            >
              <div className={`${styles.shimmerEffect} ${isHovered ? styles.shimmerVisible : styles.shimmerHidden}`} />
              <Text
                className={styles.fieldTypeText}
                style={{
                  color: currentFieldTypeStyle.textColor,
                }}
              >
                {field.key}: {field.type}
              </Text>
            </div>
          )}

          {field.type === "Nested" && (
            <div className={styles.nestedSection}>
              <Divider orientation="left" className={styles.nestedDivider}>
                <Space>
                  <span>Nested Fields</span>
                  <Badge
                    count={field.children.length}
                    className={field.children.length > 0 ? styles.nestedBadge : ""}
                    style={{
                      backgroundColor: currentFieldTypeStyle.textColor,
                    }}
                  />
                </Space>
              </Divider>

              <div className={styles.nestedContainer}>
                {field.children.length === 0 ? (
                  <div className={styles.nestedEmptyState}>
                    <Text type="secondary" className={styles.nestedEmptyText}>
                      ✨ No nested fields yet. Click below to add your first nested field!
                    </Text>
                  </div>
                ) : (
                  field.children.map((childField, childIndex) => (
                    <FieldRow
                      key={childField.id || childIndex}
                      field={childField}
                      onChange={(updatedChild) => handleNestedFieldChange(childIndex, updatedChild)}
                      onDelete={() => removeNestedField(childIndex)}
                      nestingLevel={nestingLevel + 1}
                      isNewlyAdded={childField.isNew}
                    />
                  ))
                )}

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={addNestedField}
                  className={styles.addNestedButton}
                  style={{
                    marginTop: field.children.length > 0 ? "12px" : "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.classList.add(styles.addNestedButtonHovered)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.classList.remove(styles.addNestedButtonHovered)
                  }}
                >
                  Add Nested Field
                </Button>
              </div>
            </div>
          )}
        </Space>
      </Card>
    </div>
  )
}

const SchemaBuilder = () => {
  const [schemaFields, setSchemaFields] = useState([createDefaultField()])
  const [currentActiveTab, setCurrentActiveTab] = useState("1")

  const updateSchemaField = (fieldIndex, updatedField) => {
    const updatedFields = [...schemaFields]
    updatedFields[fieldIndex] = updatedField
    setSchemaFields(updatedFields)
  }

  const addNewSchemaField = () => {
    const newField = { ...createDefaultField(), isNew: true }
    setSchemaFields([...schemaFields, newField])
  }

  const removeSchemaField = (fieldIndex) => {
    const updatedFields = [...schemaFields]
    updatedFields.splice(fieldIndex, 1)
    setSchemaFields(updatedFields)
  }

  const tabConfiguration = [
    {
      key: "1",
      label: (
        <Space className={styles.tabLabel}>
          <SettingOutlined className={currentActiveTab === "1" ? styles.spinIcon : ""} />
          Schema Builder
        </Space>
      ),
      children: (
        <div className={styles.builderTab}>
          <div className={styles.floatingElement1} />
          <div className={styles.floatingElement2} />

          <div className={styles.contentContainer}>
            <div className={styles.header}>
              <Title level={2} className={styles.title}>
                🛠️ Design Your JSON Schema
              </Title>
              <Text type="secondary" className={styles.subtitle}>
                Create and customize your JSON schema structure with nested fields
              </Text>
            </div>

            <div className={styles.fieldsContainer}>
              {schemaFields.length === 0 ? (
                <Card className={styles.emptyState}>
                  <Text type="secondary" className={styles.emptyStateText}>
                    ✨ No fields yet. Add your first field to get started!
                  </Text>
                </Card>
              ) : (
                schemaFields.map((field, fieldIndex) => (
                  <FieldRow
                    key={field.id || fieldIndex}
                    field={field}
                    onChange={(updatedField) => updateSchemaField(fieldIndex, updatedField)}
                    onDelete={() => removeSchemaField(fieldIndex)}
                    isNewlyAdded={field.isNew}
                  />
                ))
              )}
            </div>

            <div className={styles.addFieldContainer}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addNewSchemaField}
                size="large"
                className={styles.addFieldButton}
              >
                Add New Field
              </Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Space className={styles.tabLabel}>
          <EyeOutlined className={currentActiveTab === "2" ? styles.blinkIcon : ""} />
          JSON Preview
        </Space>
      ),
      children: (
        <div className={styles.previewTab}>
          {Array.from({ length: 5 }, (_, particleIndex) => (
            <div
              key={particleIndex}
              className={styles.particle}
              style={{
                width: `${20 + particleIndex * 10}px`,
                height: `${20 + particleIndex * 10}px`,
                top: `${20 + particleIndex * 15}%`,
                left: `${10 + particleIndex * 20}%`,
                animationDelay: `${particleIndex * 0.5}s`,
              }}
            />
          ))}

          <div className={styles.contentContainer}>
            <div className={styles.header}>
              <Title level={2} className={styles.previewTitle}>
                📄 JSON Schema Preview
              </Title>
              <Text type="secondary" className={styles.subtitle}>
                Live preview of your generated JSON schema
              </Text>
            </div>

            <Card className={styles.codePreviewCard} bodyStyle={{ padding: 0 }}>
              <div className={styles.codeHeader}>
                <CodeOutlined className={styles.codeIcon} />
                <Text className={styles.codeFileName}>schema.json</Text>

                <div className={styles.windowControls}>
                  <div className={`${styles.windowControl} ${styles.windowControlRed}`} />
                  <div className={`${styles.windowControl} ${styles.windowControlYellow}`} />
                  <div className={`${styles.windowControl} ${styles.windowControlGreen}`} />
                </div>
              </div>

              <pre className={styles.codeContent}>{JSON.stringify(convertToJSONSchema(schemaFields), null, 2)}</pre>
            </Card>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        <Tabs
          activeKey={currentActiveTab}
          onChange={setCurrentActiveTab}
          items={tabConfiguration}
          className={styles.tabsContainer}
          tabBarStyle={{
            margin: "0 20px",
            borderBottom: "3px solid #f0f0f0",
            borderRadius: "8px 8px 0 0",
          }}
        />
      </div>
    </div>
  )
}

export default SchemaBuilder
