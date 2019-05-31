# Memory Types, Segments, and Management
* [Introduction to Memory Organization](#introduction-to-memory-organization)
* [Memory Architectures](#memory-architectures)
* [Memory Segments](#memory-segments)
* [Data Memory](#data-memory)
* [Special Keywords](#special-keywords)
* [The Stack](#the-stack)
* [The Heap](#the-heap)
* [Code Memory](#code-memory)

# Introduction to Memory Organization
![](docs/1_intro_bit_byte.png)

![](docs/1_intro_hierarchy.png)

![](docs/1_intro_memory_sizes.png)
* determine **memory footprint** before selecting a platform
* **FLASH**
	* program code
	* does *not* require power to retain information
	* ranges from 32 KB to 256 KB
* **RAM**
	* program data
	* requires power to retain information
	* ranges from 4 KB to 32 KB

![](docs/1_intro_memory_regions_linker1.png)

![](docs/1_intro_memory_regions_linker2.png)
* software to hardware translation
	* **linker file** describes memory regions to the build system
		* segment to sub-segment code to memory mapping
		* build a program with assigned memory addresses

![](docs/1_intro_controller_bus.png)
* **dedicated controller** needed to configure, read, and write data in **FLASH** and **RAM** memory
	* built into the microcontroller
	* communicates with the **CPU** via a **BUS**

* *Example: add external memory to your system*
	* **EEPROM:** electrically erasable programmable read-only memory
	* **GPIO:** general purpose input/output
	* **SPI:** serial peripheral interface

![](docs/1_intro_registers.png)
* **register** memory
	* *not* associated with the installed program
	* exists across multiple microcontroller entities
	* stores configuration and runtime information ( the state of a program )
* **general purpose** registers store operands for CPU instructions
* **special purpose** registers store program state
	* current instruction
	* program counter

![](docs/1_intro_memory_tradeoffs.png)

![](docs/1_intro_outcomes.png)

# Memory Architectures
![](docs/2_arch_model.png)

![](docs/2_arch_iface.png)

![](docs/2_arch_chars.png)

## Capacity
![](docs/2_arch_cap.png)

## Volatility
![](docs/2_arch_vol.png)

![](docs/2_arch_vol_endur1.png)

![](docs/2_arch_vol_endur2.png)

![](docs/2_arch_vol_endur3.png)

![](docs/2_arch_vol_endur4.png)

![](docs/2_arch_vol_endur5.png)

![](docs/2_arch_vol_endur6.png)

## Access
![](docs/2_arch_access1.png)

![](docs/2_arch_access2.png)

## Latency
![](docs/2_arch_latency.png)


# Memory Segments
![](docs/3_seg_linker.png)

![](docs/3_seg_platform1.png)

![](docs/3_seg_platform2.png)

* Compiler
	* platform independent
	* CPU target architecture dependent
* Linker
	* platform dependent

![](docs/3_seg_memmap.png)
* executable is mapped into physical memory (address space) via locating
* single address space, multiple segments / sub-segments

![](docs/3_seg_regs.png)

![](docs/3_seg_abi.png)
* ABI = application binary interface
	* compiler rules to perform translation from high-level language to architecture specific machine code
		* how to use the CPU and its registers

![](docs/3_seg_platform.png)

![](docs/3_seg_reg_def.png)

![](docs/3_seg_codedata1.png)

![](docs/3_seg_codedata2.png)

![](docs/3_seg_codedata3.png)

![](docs/3_seg_linker_subsegs.png)
* **.data**
	* stack
	* heap
	* data
	* bss = block started by symbol [[wikipedia.org](https://en.wikipedia.org/wiki/.bss)]
		* in embedded software, the bss segment is mapped into memory that is initialized to zero by the C run-time system before main() is entered
		* **"Better Save Space"** since the BSS segment only holds variables that don't have any value yet, it doesn't actually need to store the image of these variables
* **.code**
	* intvecs = interupt vectors
	* text
	* read-only data
	* bootloader


# Data Memory
A data segment contains many different segments that are used for different kinds of data, allocation of data
can be at compile time or at run time.  Certain parts of the data segment can be reused and others exist
for the lifetime of a program.  Scope and access to variables can also dictate the section of the data segment
where certain pieces of data exist. 

![](docs/4_data_seg_linker.png)

![](docs/4_data_memory_is.png)

![](docs/4_data_allocation.png)

![](docs/4_data_segments.png)

![](docs/4_data_examples.png)

![](docs/4_data_segments_linker1.png)

![](docs/4_data_segments_linker2.png)

![](docs/4_data_segments_linker3.png)

![](docs/4_data_characteristics.png)

![](docs/4_data_var_scope1.png)

![](docs/4_data_var_scope2.png)

![](docs/4_data_var_scope3.png)

![](docs/4_data_var_scope4.png)

![](docs/4_data_eeprom.png)
* external non-volatile memory can be connected to the microcontroller to retain data between power cycles

![](docs/4_data_init_vars.png)

# Special Keywords (Const, Extern, Static)
![](docs/5_data_characteristics.png)

![](docs/5_data_locations.png)

![](docs/5_c_keywords.png)

![](docs/5_const_keyword1.png)

![](docs/5_const_keyword2.png)

![](docs/5_type_modifiers.png)

![](docs/5_storage_classes.png)

![](docs/5_auto_keyword.png)

![](docs/5_static_keyword.png)

![](docs/5_extern_keyword.png)

![](docs/5_register_keyword.png)

![](docs/5_data_segment_summary.png)

# The Stack

The stack is a vital memory segment for software developers. Stack is automatically used by the compiler, which in turn utilized architecture-specific processes and instructions to call and return from a routine. All of these operations get compiled into the function call. There's still overhead, in order to call and return from a function, and the memory region of the stack occupies part of data memory. This is reserved at compile time, allocated at run time, and the operations to interact with this region are introduced at compilation. However, the memory itself is reused throughout the program as different functions can get called to allocate and de-allocate data in this region.

![](docs/6_stack.png)

![](docs/6_stack_characteristics.png)

![](docs/6_calling_convention.png)

A programmer can nest routines within one another. And the program has the ability to enter and return from each of these routines, without effecting the calling routine's state. The method of describing how to pass data in and out of a routine is referred to as a calling convention. This can be generalized across all routines in an architecture.  A calling convention should specify architecture specific concepts on how the CPU and the stack are used. Calling conventions differ across architectures, as ARM architecture have different calling conventions from other risk type processors. This is because internal CPU registers and a stack memory management needs to be modified to accommodate a change in normal execution flow, the stack is used to allocate, save, and restore information for a calling convention.

![](docs/6_stack_implementation.png)

![](docs/6_stack_frame1.png)

![](docs/6_stack_frame2.png)

![](docs/6_stack_frame3.png)

![](docs/6_stack_registers1.png)

![](docs/6_stack_registers2.png)

![](docs/6_stack_registers3.png)

![](docs/6_stack_growth.png)

![](docs/6_stack_operations.png)

![](docs/6_stack_overflow.png)

# The Heap

As embedded system architectures scale up in complexity and size, the likelihood of heap use on a system is a near guarantee. The heap requires direct invocations to utilize the memory, which leads to more overhead spent by the CPU to manage this region at runtime. This overhead existed with the stack as well, but the heap has the nice advantage of giving us a dynamic piece of memory that can have a lifetime longer than a function but less than a program.

![](docs/7_heap1.png)

![](docs/7_heap2.png)

![](docs/7_heap_lifetime.png)

![](docs/7_heap_functions1.png)

![](docs/7_heap_functions2.png)

![](docs/7_heap_functions3.png)

![](docs/7_heap_allocation1.png)

![](docs/7_heap_allocation2.png)

![](docs/7_heap_functions4.png)

![](docs/7_failed_allocation.png)

![](docs/7_malloc_example.png)

![](docs/7_fragmentation.png)

![](docs/7_heap_issues.png)

# Code Memory

Code memory contains our program and also our data in some cases. The code memory is usually a lot larger than our data memory, because code memory is not meant to be rewritten during run time. When we install program code, we want that information to persist in between power cycles. More advanced architectures with embedded OS support allow for code memory to be written and installed while the processor is running. But most microcontrollers do not support it this way. Installing a new program requires a very particular process to interface with the flash memory. However, the way we broke down a program's code memory into the code segment is very similar to how we divided our data memory into smaller subsegments of data.

![](docs/8_three_types_of_memory.png)

![](docs/8_code_memory.png)

![](docs/8_linker_file.png)

![](docs/8_memory_segments.png)

![](docs/8_vector_table1.png)

![](docs/8_vector_table2.png)

![](docs/8_text_segment.png)

![](docs/8_const_segment.png)

![](docs/8_init_segments1.png)

![](docs/8_init_segments2.png)

![](docs/8_bootloader1.png)

![](docs/8_bootloader2.png)

![](docs/8_std_libs.png)

One last note about these code segments and these C standard functions. You do not automatically need to include these. Compilers will automatically use some C standard functions when your code is compiled. You can avoid the addition of all these extra sub segments by writing your own bare metal C with no standard library compiler flags. Or by writing your own assembly directly. However, this is not suggested as some of the standards library functionality makes writing your programs much easier. Like defining what happens at start up and program completion. In addition, it will map unsupported operations for your architecture into equivalent software processes.


