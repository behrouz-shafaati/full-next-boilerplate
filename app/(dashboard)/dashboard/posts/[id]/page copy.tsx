'use client';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Transforms, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DraggableList from '@/components/page-builder';
const HoveringRichText = dynamic(
  () => import('@/components/rich-text/hovering-rich-text'),
  { ssr: false }
);

type CustomElement =
  | { type: 'paragraph'; children: { text: string }[] }
  | { type: 'image'; url: string; children: { text: string }[] }
  | { type: 'video'; url: string; children: { text: string }[] };

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor;
    Element: CustomElement;
  }
}

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'شروع به نوشتن کنید...' }] },
  {
    type: 'video',
    url: 'https://www.youtube.com/watch?v=1Qy6WfWbE2k',
    children: [{ text: 'شروع به نوشتن کنید...' }],
  },
];

const CustomElement = (props: any) => {
  const { attributes, children, element } = props;
  const editor = props.editor;

  const handleDelete = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path });
  };

  switch (element.type) {
    case 'image':
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <img src={element.url} alt="Image" style={{ maxWidth: '100%' }} />
            <button onClick={handleDelete}>حذف</button>
          </div>
          {children}
        </div>
      );
    case 'video':
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <video src={element.url} controls style={{ maxWidth: '100%' }} />
            <button onClick={handleDelete}>حذف</button>
          </div>
          {children}
        </div>
      );
    case 'paragraph':
    default:
      return (
        <div {...attributes}>
          <HoveringRichText initialValue={element.children} />
        </div>
      );
  }
};

const HomePage = () => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const renderElement = useCallback(
    (props: any) => <CustomElement {...props} editor={editor} />,
    [editor]
  );

  const addBlock = (type: string) => {
    let newBlock: CustomElement;
    if (type === 'image') {
      const url = prompt(
        'آدرس تصویر را وارد کنید:',
        'https://example.com/image.jpg'
      );
      newBlock = { type: 'image', url: url || '', children: [{ text: '' }] };
    } else if (type === 'video') {
      const url = prompt(
        'آدرس ویدیو را وارد کنید:',
        'https://example.com/video.mp4'
      );
      newBlock = { type: 'video', url: url || '', children: [{ text: '' }] };
    } else {
      newBlock = { type: 'paragraph', children: [{ text: 'بلوک جدید' }] };
    }

    // استفاده از Transforms برای درج بلوک جدید
    Transforms.insertNodes(editor, newBlock);
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
  });

  // مدیریت جابجایی بلوک‌ها با Slate API
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const [block] = Transforms.removeNodes(editor, {
      at: [result.source.index],
    });
    Transforms.insertNodes(editor, block, {
      at: [result.destination.index],
    });
  };

  const initialRichValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [
        {
          text: 'این متن تست می‌شود. برای مثال، ',
        },
        { text: 'متن بولد', bold: true },
        { text: ', ' },
        { text: 'ایتالیک', italic: true },
        { text: ', و هر چیزی دیگر!' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: 'شهریه پودمان اول 27/000/000 (بیست و هفت میلیون ریال) می باشد که مهارت آموز باید نسبت به پرداخت این مبلغ اقدام نماید در صورت عدم پرداخت امکان انتخاب واحد میسر نمی باشد. باقی مانده شهریه که مربوط به پودمان دوم می باشد مبلغ 27/000/000 (بیست و هفت میلیون ریال)که جهت رفاه حال مهارت آموزان تا پایان دوره (قبل از آزمون اصلح) موظف به پرداخت آن در سامانه مروارید می باشند. ',
        },
        {
          text: 'select any piece of text and the menu will appear',
          bold: true,
        },
        { text: '.' },
      ],
    },
  ];

  return (
    <div>
      <DraggableList />
      <HoveringRichText initialValue={initialRichValue} />
      <h1>ویرایشگر و پیج بیلدر با دراگ‌-اند‌-دراپ</h1>
      <button onClick={() => addBlock('image')}>افزودن تصویر</button>
      <button onClick={() => addBlock('video')}>افزودن ویدیو</button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="editor-blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {value.map((block, index) => (
                <Draggable
                  key={index}
                  draggableId={`block-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {renderElement({ element: block, attributes: {} })}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default HomePage;

// ==============================================================

// import { BreadCrumb } from '@/components/breadcrumb';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import React from 'react';
// import categoryCtrl from '@/lib/entity/category/controller';
// import { notFound } from 'next/navigation';
// import { CategoryForm } from '@/components/forms/category-form';

// import CategoryModel from '@/lib/entity/category/schema';

// type PageProps = {
//   params: { id: string };
// };
// export default async function Page({ params }: PageProps) {
//   let category = null,
//     allCategories;
//   let pageBreadCrumb = {
//     title: 'افزودن',
//     link: '/dashboard/categories/create',
//   };
//   if (params.id !== 'create') {
//     const id = params.id;
//     [category, allCategories] = await Promise.all([
//       categoryCtrl.findById({ id }),
//       categoryCtrl.findAll({}),
//     ]);

//     if (!category) {
//       notFound();
//     }
//     pageBreadCrumb = {
//       title: category.title,
//       link: `/dashboard/categories/${params.id}`,
//     };
//   } else {
//     [allCategories] = await Promise.all([categoryCtrl.findAll({})]);
//   }

//   const breadcrumbItems = [
//     { title: 'مطالب', link: '/dashboard/categories' },
//     pageBreadCrumb,
//   ];
//   return (
//     <ScrollArea className="h-full">
//       <div className="flex-1 space-y-4 p-5">
//         <BreadCrumb items={breadcrumbItems} />
//         <CategoryForm
//           initialData={category}
//           allCategories={allCategories.data}
//         />
//       </div>
//     </ScrollArea>
//   );
// }
